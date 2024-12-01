from rest_framework.reverse import reverse
from rest_framework.exceptions import ValidationError
from django.db import IntegrityError, transaction
from django.utils import timezone
from users.utils import get_current_term
from rest_framework import serializers
from users.models import User, School, Course, Programme, Grade, Term
from users.serializers import UserSerializer, ProgrammeSerializer, GradeSerializer, TermSerializer
from .models import Question, Choice, Test, StudentAnswer, StudentTestSession

class ChoiceSerializer(serializers.ModelSerializer):
    school = serializers.PrimaryKeyRelatedField(queryset=School.objects.all(), required=False)

    class Meta:
        model = Choice
        fields = '__all__'

class ChoiceSerializerForTest(serializers.ModelSerializer):
    school = serializers.PrimaryKeyRelatedField(queryset=School.objects.all(), required=False)

    class Meta:
        model = Choice
        exclude = ('is_correct',)  # Exclude the is_correct field 

class QuestionSerializer(serializers.ModelSerializer):
    school = serializers.PrimaryKeyRelatedField(queryset=School.objects.all(), required=False)
    choices = ChoiceSerializer(many=True)
    #choices = ChoiceSerializerForTest(many=True, read_only=True)
    fill_in_the_blanks_data = serializers.JSONField(read_only=True)
    
    class Meta:
        model = Question
        fields = '__all__'
        extra_kwargs = {
            'test': {'required': False},
        }

    def create(self, validated_data):
        choices_data = validated_data.pop('choices', [])
        question = Question.objects.create(**validated_data)
        for choice_data in choices_data:
            Choice.objects.create(question=question, **choice_data)
        return question

    def update(self, instance, validated_data):
        choices_data = validated_data.pop('choices', [])
        instance = super().update(instance, validated_data)
        instance.choices.all().delete()
        for choice_data in choices_data:
            Choice.objects.create(question=instance, **choice_data)
        return instance

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # Include choices for MCQ and TF question types
        if instance.question_type != ['MCQ', 'TF']:
            ret.pop('choices', None)
        elif instance.question_type == 'FB':
            # Include the fill-in-the-blanks data for "FB" type questions
            ret['fill_in_the_blanks_data'] = instance.fill_in_the_blanks_data
        return ret

class QuestionSerializerForTest(serializers.ModelSerializer):
    school = serializers.PrimaryKeyRelatedField(queryset=School.objects.all(), required=False)
    #choices = ChoiceSerializer(many=True, read_only=True)
    choices = ChoiceSerializerForTest(many=True, read_only=True)
    #fill_in_the_blanks_data = serializers.JSONField(read_only=True)
    
    class Meta:
        model = Question  
        exclude = ('correct_answer', )

    def get_choices(self, obj):
        if obj.question_type in ['MCQ', 'TF']:  # Types that have choices
            return ChoiceSerializer(obj.choices, many=True).data
        return None  # No choices for other types

class QuestionWithAnswerSerializer(serializers.ModelSerializer):
    school = serializers.PrimaryKeyRelatedField(queryset=School.objects.all(), required=False)
    student_answer = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = '__all__'  # or list the fields you want to include

    def get_student_answer(self, obj):
        # Get the test session from the context, passed in when initializing the serializer
        test_session_id = self.context.get('test_session_id')
        # Filter the student answers for the question and test session
        answers = StudentAnswer.objects.filter(question=obj, test_session_id=test_session_id)
        # Return the serialized data of the first answer, or None if no answer exists
        if answers.exists():
            return StudentAnswerSerializer(answers.first()).data
        return None

class TestSerializer(serializers.ModelSerializer):
    school = serializers.PrimaryKeyRelatedField(queryset=School.objects.all(), required=False)
    questions = QuestionSerializer(many=True)
    programme = serializers.PrimaryKeyRelatedField(queryset=Programme.objects.all())
    grade = serializers.PrimaryKeyRelatedField(queryset=Grade.objects.all())
    term = serializers.PrimaryKeyRelatedField(queryset=Term.objects.all())
    #lecturer_name = serializers.SerializerMethodField()
    #course_name = serializers.SerializerMethodField()

    class Meta:
        model = Test
        fields = '__all__'

    #def get_lecturer_name(self, obj):
    #    return obj.author.username

    #def get_course_name(self, obj):
    #    return obj.course.name

    def __init__(self, *args, **kwargs):
        context = kwargs.pop('context', None)
        super(TestSerializer, self).__init__(*args, **kwargs)
        if context:
            self.context.update(context)


    def create(self, validated_data):
        questions_data = validated_data.pop('questions')
        test = Test.objects.create(**validated_data)
        for question_data in questions_data:
            choices_data = question_data.pop('choices', [])
            question = Question.objects.create(test=test, **question_data)
            for choice_data in choices_data:
                Choice.objects.create(question=question, **choice_data)
        return test

    def update(self, instance, validated_data):
        questions_data = validated_data.pop('questions', [])
        instance = super().update(instance, validated_data)
        instance.questions.all().delete()
        for question_data in questions_data:
            choices_data = question_data.pop('choices', [])
            question = Question.objects.create(test=instance, **question_data)
            for choice_data in choices_data:
                Choice.objects.create(question=question, **choice_data)
        return instance

class TestSerializerForTest(serializers.ModelSerializer):
    school = serializers.PrimaryKeyRelatedField(queryset=School.objects.all(), required=False)
    questions = QuestionSerializerForTest(many=True, read_only=True)
    programme = ProgrammeSerializer(read_only=True)
    grade = GradeSerializer(read_only=True)
    term = TermSerializer(read_only=True)
    
    class Meta:
        model = Test
        fields = '__all__' 

class TestListSerializer(serializers.ModelSerializer):
    # Add a SerializerMethodField to generate the URL
    submitted_test_url = serializers.SerializerMethodField()
    auto_mark = serializers.BooleanField(read_only=True)

    class Meta:
        model = Test
        fields = ['id', 'title', 'course', 'submitted_test_url','date_created', 'auto_mark']

    def get_submitted_test_url(self, obj):
        # Generate the URL for the detailed view of the submitted tests
        request = self.context.get('request')
        return reverse('submitted-tests', kwargs={'test_id': obj.id}, request=request)    

class TestDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = '__all__' # or list all fields you want to include

class StudentTestSessionSerializer(serializers.ModelSerializer):
    school = serializers.PrimaryKeyRelatedField(queryset=School.objects.all(), required=False)
    student = UserSerializer(read_only=True)
    test = TestSerializer(read_only=True)

    class Meta:
        model = StudentTestSession
        fields = ['school', 'student', 'test', 'start_time', 'end_time', 'total_marks']

class StudentAnswerSerializer(serializers.ModelSerializer):
    selected_choice = ChoiceSerializer(read_only=True)
    
    class Meta:
        model = StudentAnswer
        fields = ['id', 'school', 'student', 'question', 'selected_choice', 'text_answer', 'test', 'test_session']    


class AnswerSubmissionSerializer(serializers.Serializer):
    question_sequence_number = serializers.IntegerField(write_only=True)
    choice_sequence_number = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    text_answer = serializers.CharField(write_only=True, required=False, allow_blank=True, allow_null=True)

    #class Meta:
    #   model = StudentAnswer
    #fields = ['question', 'selected_choice']  # Adjust fields as needed

class TestSubmissionSerializer(serializers.Serializer):
    test_id = serializers.PrimaryKeyRelatedField(queryset=Test.objects.all(), write_only=True)
    test_session_id = serializers.PrimaryKeyRelatedField(queryset=StudentTestSession.objects.all(), write_only=True)
    answers = AnswerSubmissionSerializer(many=True)


    #def validate_test_id(self, value):
        #user = self.context['user']

        # Fetch the student profile from the user
        #student_profile = StudentProfile.objects.filter(user=user).first()
        #if not student_profile:
        #    raise serializers.ValidationError("Student profile not found.")

        # Check if the test matches the student's programme, grade, and term
        #if (value.programme != student_profile.programme or
        #    value.grade != student_profile.grade or
        #    value.term != get_current_term()):  # Implement get_current_term as per your application logic
        #    raise serializers.ValidationError("This test is not appropriate for your current programme, grade, or term.")
        #
        #return value


    def create(self, validated_data):
        test = validated_data['test_id']
        user = self.context['request'].user
        test_session = validated_data['test_session_id']

        if test_session.is_time_exceeded():
            raise ValidationError('Time limit exceeded for this test.')

        answers_data = validated_data.pop('answers')
        student_answers = []
        total_marks = 0

        for answer_data in answers_data:
            question = None
            selected_choice = None
            text_answer = answer_data.get('text_answer', None)

            try:
                question = Question.objects.get(
                    sequence_number=answer_data['question_sequence_number'],
                    test=test
                )

            except Question.DoesNotExist:
                raise ValidationError({'question_sequence_number': 'Question with this sequence number does not exist.'})

            if question.question_type in ['MCQ', 'TF']:
                try:
                    selected_choice = Choice.objects.get(
                        sequence_number=answer_data.get('choice_sequence_number'),
                        question=question
                    )

                except Choice.DoesNotExist:
                    raise ValidationError({'choice_sequence_number': 'Choice with this sequence number does not exist.'})
                
                if question and selected_choice:
                    student_answer = StudentAnswer(
                        student=user,
                        question=question,
                        selected_choice=selected_choice,
                        test=test,
                        test_session=test_session
                    )

            elif question.question_type in ['SA', 'ESSAY']:

                # For text-based questions, get the text answer
                text_answer = answer_data.get('text_answer')
                if text_answer is None or text_answer.strip() == "":
                    # Handle the case where a text answer is required but not provided
                    raise ValidationError({'text_answer': 'This field is required for short answer and essay questions.'})

                student_answer = StudentAnswer(
                    student=user,
                    question=question,
                    text_answer=text_answer,  # Use the text_answer field for SA and ESSAY
                    test=test,
                    test_session=test_session
                )

            elif question.question_type == 'FB':

                # Handling fill in the blanks questions
                text_answers = answer_data.get('text_answer', '').split('|')  # Splitting the answers
                correct_answers = question.fill_in_the_blanks_data.get('blanks', [])

                # Validate the number of answers
                if len(text_answers) != len(correct_answers):
                    raise ValidationError({'text_answer': 'Number of answers does not match number of blanks'})

                # Validate each answer
                is_fill_in_correct = True  # Initialize the flag as True

                # Iterate over each pair of user answer and correct answer
                for user_answer, correct_answer in zip(text_answers, correct_answers):
                    if user_answer.strip().lower() != correct_answer['correct_answer'].lower():
                        # Set flag to False if any answer doesn't match
                        is_fill_in_correct = False
                        # Exit the loop as soon as one incorrect answer is found
                        break

                student_answer = StudentAnswer(
                    student=user,
                    question=question,
                    text_answer=text_answer, 
                    test=test,
                    test_session=test_session,
                    is_fill_in_correct=is_fill_in_correct  
                )

            else:

                # Handle other types of questions if any
                #raise ValidationError({'question_type': 'Unsupported question type'})
                pass

            student_answers.append(student_answer)

                #if test.auto_mark and selected_choice.is_correct:
                #    total_marks += question.marks

        # Now handle unanswered questions
        # Get the IDs of all questions that belong to the test
        all_questions_ids = set(test.questions.values_list('id', flat=True))
        # Get the IDs of questions that have been answered
        answered_questions_ids = set([answer.question.id for answer in student_answers])
        # Determine which questions have not been answered by subtracting the two sets
        unanswered_questions_ids = all_questions_ids - answered_questions_ids
        
        # Create StudentAnswer instances for unanswered questions with no selected choice
        unanswered_student_answers = [
            StudentAnswer(student=user, question_id=question_id, selected_choice=None, test=test, test_session=test_session)
            for question_id in unanswered_questions_ids
        ]  

        # Combine answered and unanswered student answers
        all_student_answers = student_answers + unanswered_student_answers          

        StudentAnswer.objects.bulk_create(all_student_answers)
        
        # Recalculate total marks if auto_mark is enabled
        if test.auto_mark:
            # You can now call calculate_total_marks directly since you're inside the Serializer class
            total_marks = self.calculate_total_marks(test_session, test)
            test_session.total_marks = total_marks
            test_session.save()
        
        # Update the test_session end_time to the current time
        test_session.end_time = timezone.now()
        test_session.save()

        return {
            'test_id': test,
            'answers': all_student_answers,  # Combine both lists
            'total_marks': total_marks if test.auto_mark else None
        }


    # method to calculate total marks
    def calculate_total_marks(self, test_session, test):
        # Fetch all answers related to this test session
        answers = StudentAnswer.objects.filter(test_session=test_session)

        # Use a set to track which questions have been marked
        marked_questions = set()

        total_marks = 0
        for answer in answers:
            question_id = answer.question.id

            # Skip this question if it has already been marked
            if question_id in marked_questions:
                continue

            # Mark this question as having been evaluated
            marked_questions.add(question_id)

            # For MCQ and TF questions, check if the selected choice is correct and add marks
            if answer.question.question_type in ['MCQ', 'TF'] and answer.selected_choice and answer.selected_choice.is_correct:
                total_marks += answer.question.marks

            # For Fill in the Blanks questions, check if the answer is correct
            elif answer.question.question_type == 'FB':
                student_answers = answer.text_answer.split('|') if answer.text_answer else [] # Assuming '|' is used as the separator for multiple blanks
                correct_answers = answer.question.fill_in_the_blanks_data.get('blanks', [])

                # Calculate the total number of blanks
                num_blanks = len(correct_answers)
                # Calculate marks per blank assuming equal distribution of marks for each blank
                marks_per_blank = answer.question.marks / num_blanks if num_blanks else 0
                
                # Check each blank's answer
                for idx, correct_answer in enumerate(correct_answers):
                    # Check if student provided answer for this blank
                    if idx < len(student_answers) and student_answers[idx].strip().lower() == correct_answer['correct_answer'].strip().lower():
                        # If correct, add marks for this blank to the total marks
                        # Assuming equal distribution of marks for each blank
                        total_marks += marks_per_blank

        return total_marks



class StudentAnswerDetailSerializer(serializers.ModelSerializer):
    school = serializers.PrimaryKeyRelatedField(queryset=School.objects.all(), required=False)
    question = QuestionSerializer(read_only=True)
    selected_choice = ChoiceSerializer(read_only=True)
    text_answer = serializers.CharField(read_only=True)
    student = serializers.StringRelatedField()  # This assumes that User model has a __str__ method defined

    class Meta:
        model = StudentAnswer
        fields = ['id', 'school', 'student', 'question', 'selected_choice', 'text_answer', 'test']

