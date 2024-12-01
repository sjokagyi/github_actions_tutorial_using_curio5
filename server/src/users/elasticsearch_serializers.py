'''from rest_framework import serializers
from .documents import UserDocument

class UserDocumentSerializer(serializers.Serializer):
    id = serializers.CharField()
    username = serializers.CharField()
    email = serializers.EmailField()
    first_name = serializers.CharField()
    middle_name = serializers.CharField()
    last_name = serializers.CharField()
    user_type = serializers.CharField()
    primary_contact = serializers.CharField()
    secondary_contact = serializers.CharField()
    residence = serializers.CharField()
    school = serializers.JSONField()  # Assuming school is a nested object
    college = serializers.JSONField(required=False)  # Assuming college is a nested object
    faculty = serializers.JSONField(required=False)  # Assuming faculty is a nested object
    programme = serializers.JSONField(required=False)  # Assuming programme is a nested object
    courses = serializers.JSONField(required=False)  # Assuming courses is a nested list

    class Meta:
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'middle_name',
            'last_name',
            'user_type',
            'primary_contact',
            'secondary_contact',
            'residence',
            'school',
            'college',
            'faculty',
            'programme',
            'courses',
        ]

    def to_representation(self, instance):
        """
        Convert Elasticsearch hit into the desired format.
        """
        if hasattr(instance, '_source'):
            source = instance._source
        elif hasattr(instance, 'meta') and hasattr(instance.meta, 'raw'):
            source = instance.meta.raw['_source']
        else:
            raise KeyError("Instance does not have '_source' or 'meta.raw._source'")

        return {
            'id': source.get('id'),
            'username': source.get('username'),
            'email': source.get('email'),
            'first_name': source.get('first_name'),
            'middle_name': source.get('middle_name'),
            'last_name': source.get('last_name'),
            'user_type': source.get('user_type'),
            'primary_contact': source.get('primary_contact'),
            'secondary_contact': source.get('secondary_contact'),
            'residence': source.get('residence'),
            'school': source.get('school'),
            'college': source.get('college'),
            'faculty': source.get('faculty'),
            'programme': source.get('programme'),
            'courses': source.get('courses'),
        }
'''