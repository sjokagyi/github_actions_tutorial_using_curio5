from rest_framework import serializers
from .models import Resource, Comment, Tag, TestUpload
from users.models import User, Course, School
from .documents import ResourceDocument
from users.serializers import UserSerializer, SchoolSerializer, CourseSerializer

class TestUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestUpload
        fields = ['id', 'title', 'file']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'resource', 'user', 'text', 'created_at']
        read_only_fields = ['resource', 'user', 'created_at']

    def create(self, validated_data):
        user = self.context['request'].user
        resource = self.context['resource']
        return Comment.objects.create(user=user, resource=resource, **validated_data)

class ResourceSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)
    school = SchoolSerializer(read_only=True)
    course = CourseSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Resource
        fields = [
            'id', 'title', 'description', 'file', 'link', 'resource_type', 
            'uploaded_by', 'school', 'course', 'tags', 'comments', 'upload_date'
        ]
        read_only_fields = ['uploaded_by', 'school', 'upload_date']

    def create(self, validated_data):
        user = self.context['request'].user
        school = self.context['school']
        course = self.context['course']
        tags_data = self.initial_data.get('tags')
        resource = Resource.objects.create(uploaded_by=user, school=school, course=course, **validated_data)
        
        # Add tags to the resource
        if tags_data:
            for tag_data in tags_data:
                tag, created = Tag.objects.get_or_create(name=tag_data['name'])
                resource.tags.add(tag)
        
        return resource

    def update(self, instance, validated_data):
        tags_data = self.initial_data.get('tags')

        # Update the resource
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.file = validated_data.get('file', instance.file)
        instance.link = validated_data.get('link', instance.link)
        instance.resource_type = validated_data.get('resource_type', instance.resource_type)
        instance.save()

        # Update tags
        if tags_data:
            instance.tags.clear()
            for tag_data in tags_data:
                tag, created = Tag.objects.get_or_create(name=tag_data['name'])
                instance.tags.add(tag)

        return instance

class ResourceDocumentSerializer(serializers.Serializer):
    title = serializers.CharField()
    description = serializers.CharField()
    resource_type = serializers.CharField()
    upload_date = serializers.DateTimeField()
