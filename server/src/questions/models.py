from django.db import models
import os
#import pyclamd
import logging
import json
from django.utils import timezone
from datetime import timedelta, datetime
from users.models import User, Course, Programme, Grade, Term, School
from django.db.models import Max
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.template.defaultfilters import filesizeformat
from pathvalidate import sanitize_filename


# Constants for file size limits
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5MB
MAX_VIDEO_SIZE = 100 * 1024 * 1024  # 100MB

class Test(models.Model):
    # Define the choices as a tuple of tuples
    TYPE_CHOICES = (
        ('MCQ', 'Multiple Choice Questions'),
        ('SA', 'Short Answer'),
        ('TF', 'True or False'),
        ('ES', 'Essay'),
        ('MX', 'Mixed'),
        ('FB', 'Fill in the Blanks')
    )

    school = models.ForeignKey(School, on_delete=models.SET_NULL, null=True, blank=True, related_name="tests")
    title = models.CharField(max_length=255)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="tests")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="tests")
    programme = models.ForeignKey(Programme, on_delete=models.CASCADE, null=True, blank=True, related_name="tests")
    grade = models.ForeignKey(Grade, on_delete=models.SET_NULL, null=True, blank=True, related_name="tests")
    term = models.ForeignKey(Term, on_delete=models.SET_NULL, null=True, blank=True, related_name="tests")
    test_type = models.CharField(max_length=3, choices=TYPE_CHOICES, default='MCQ', verbose_name='Type of Test')
    max_time = models.PositiveIntegerField(help_text="Time in minutes")
    start_time = models.DateTimeField(null=True, blank=True, help_text="The time when the test becomes available")
    end_time = models.DateTimeField(null=True, blank=True, help_text="The time when the test is no longer available")
    auto_mark = models.BooleanField(default = False)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
     

logger = logging.getLogger(__name__)   
        
class Question(models.Model):

    QUESTION_TYPES = (
        ('MCQ', 'Multiple Choice Question'),
        ('SA', 'Short Answer'),
        ('TF', 'True or False'),
        ('ES', 'Essay'),
        ('FB', 'Fill in the Blanks'),
    )

    school = models.ForeignKey(School, on_delete=models.SET_NULL, null=True, blank=True, related_name="questions")
    sequence_number = models.PositiveIntegerField(editable=False)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name="questions")
    fill_in_the_blanks_data = models.JSONField(blank=True, null=True, help_text="Data for fill in the blanks questions", default=dict)
    question_type = models.CharField(max_length=10, choices=QUESTION_TYPES, default='MCQ')
    content = models.TextField()
    image = models.ImageField(upload_to='question_images/', blank=True, null=True)
    video = models.FileField(upload_to='question_videos/', blank=True, null=True)
    marks = models.PositiveIntegerField(default=1, verbose_name='Marks for the question')
    correct_answer = models.BooleanField(default=True, null=True, blank=True, help_text="Correct answer for true/false questions")
    explanation_enabled = models.BooleanField(default=False)  # Toggle field
    explanation_text = models.TextField(blank=True)  # Explanation text field
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content[:50]

    def save(self, *args, **kwargs):
        if self.image:
            self.image.name = self.sanitize_and_unique_file_name(self.image.name)
        if self.video:
            self.video.name = self.sanitize_and_unique_file_name(self.video.name)
        if not self.pk:  # If this is a new object, not yet saved
            current_max_sequence = Question.objects.filter(test=self.test).aggregate(Max('sequence_number'))['sequence_number__max']
            self.sequence_number = (current_max_sequence or 0) + 1
        super(Question, self).save(*args, **kwargs)

    @staticmethod
    def sanitize_and_unique_file_name(filename):
        sanitized_name = sanitize_filename(filename)
        name, ext = os.path.splitext(sanitized_name)
        timestamp = timezone.now().strftime('%Y%m%d%H%M%S%f')
        unique_name = f"{name}_{timestamp}{ext}"
        return unique_name

    def clean(self):
        if self.image:
            if not self.image.name.lower().endswith(('.png', '.jpg', '.jpeg')):
                raise ValidationError(_('Unsupported file extension. Allowed extensions are .png, .jpg, .jpeg'))
            if self.image.size > MAX_IMAGE_SIZE:
                raise ValidationError(_('Image file too large ( > 5MB )'))

        if self.video:
            if not self.video.name.lower().endswith('.mp4'):
                raise ValidationError(_('Unsupported file extension. Allowed extension is .mp4'))
            if self.video.size > MAX_VIDEO_SIZE:
                raise ValidationError(_('Video file too large ( > 100MB )'))

#        self.scan_for_viruses(self.image)
#        self.scan_for_viruses(self.video)
        super().clean()

#    def scan_for_viruses(self, file):
#        if not file:
#            return
#        try:
#            cd = pyclamd.ClamdUnixSocket('/var/run/clamav/clamd.ctl')
#            file_content = file.read()
#            result = cd.scan_stream(file_content)
#            if result is not None:
#                raise ValidationError(f"Virus found in file {file.name}: {result}")
#        except pyclamd.ConnectionError:
#            logger.error("Unable to connect to ClamAV daemon for virus scanning.")
#        except TimeoutError:
#            logger.error("Timeout occurred during virus scanning.")
#        except Exception as e:
#            logger.error(f"Unexpected error during virus scanning: {e}")

class Choice(models.Model):
    school = models.ForeignKey(School, on_delete=models.SET_NULL, null=True, blank=True, related_name="choices")
    sequence_number = models.PositiveIntegerField(editable=False)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="choices")
    content = models.TextField()
    is_correct = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.pk:  # If this is a new object, not yet saved
            current_max_sequence = Choice.objects.filter(question=self.question).aggregate(Max('sequence_number'))['sequence_number__max']
            self.sequence_number = (current_max_sequence or 0) + 1
        super(Choice, self).save(*args, **kwargs)

    def __str__(self):
        return self.content[:50]

class StudentTestSession(models.Model):
    school = models.ForeignKey(School, on_delete=models.SET_NULL, null=True, blank=True, related_name="test_sessions")
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="test_sessions")
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name="test_sessions")
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    total_marks = models.PositiveIntegerField(default=0)

    def is_time_exceeded(self):
        max_end_time = self.start_time + timedelta(minutes=self.test.max_time)
        return timezone.now() >= max_end_time

    def auto_submit(self):
        if not self.end_time and self.is_time_exceeded():
            self.end_time = timezone.now()
            self.handle_unanswered_questions()
            if self.test.auto_mark:
                self.total_marks = self.calculate_total_marks()
            self.save()

    #def handle_unanswered_questions(self):
    #    all_questions = Question.objects.filter(test=self.test)
    #    answered_questions = StudentAnswer.objects.filter(test_session=self, question__in=all_questions).values_list('question', flat=True)
    #    unanswered_questions = all_questions.exclude(id__in=answered_questions)
    #    for question in unanswered_questions:
    #        StudentAnswer.objects.create(student=self.student, question=question, selected_choice=None, test=self.test, test_session=self)

    #def calculate_total_marks(self):
    #    if not self.test.auto_mark:
    #        return self.total_marks or 0
        
    #    total_marks = 0
    #    answers = StudentAnswer.objects.filter(test_session=self)
    #    for answer in answers:
    #        if answer.selected_choice and answer.selected_choice.is_correct:
    #            total_marks += answer.question.marks
    #    return total_marks      

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    class Meta:
        unique_together = ['student', 'test']

class StudentAnswer(models.Model):
    school = models.ForeignKey(School, on_delete=models.SET_NULL, null=True, blank=True, related_name="answers")
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_choice = models.ForeignKey(Choice, on_delete=models.CASCADE, null=True)
    text_answer = models.TextField(null=True, blank=True)
    is_fill_in_correct = models.BooleanField(default=False)
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    test_session = models.ForeignKey(StudentTestSession, on_delete=models.CASCADE, related_name="answers", null=True, blank=True)

    class Meta:
        unique_together = ('student', 'question', 'test')
