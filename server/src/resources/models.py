from django.db import models
from users.models import User, Course, School

class TestUpload(models.Model):
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='test_uploads/')

    def __str__(self):
        return self.title

class Resource(models.Model):

    RESOURCE_TYPES = (
        ('document', 'Document'),
        ('video', 'Video'),
        ('link', 'Link'),
    )

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to='resources/', blank=True, null=True)
    link = models.URLField(blank=True, null=True)
    resource_type = models.CharField(max_length=50, choices=RESOURCE_TYPES)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_resources')
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='resources')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='resources')
    tags = models.ManyToManyField('Tag', blank=True)
    upload_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Tag(models.Model):
    name = models.CharField(max_length=50)

class Comment(models.Model):
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
