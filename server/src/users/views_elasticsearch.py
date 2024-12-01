'''from django_elasticsearch_dsl_drf.viewsets import DocumentViewSet
from django_elasticsearch_dsl_drf.filter_backends import FilteringFilterBackend, CompoundSearchFilterBackend
from rest_framework.pagination import LimitOffsetPagination
from .documents import UserDocument
from .elasticsearch_serializers import UserDocumentSerializer

class UserDocumentViewSet(DocumentViewSet):
    document = UserDocument
    serializer_class = UserDocumentSerializer
    pagination_class = LimitOffsetPagination
    filter_backends = [
        FilteringFilterBackend,
        CompoundSearchFilterBackend,
    ]

    search_fields = (
        'username',
        'email',
        'first_name',
        'middle_name',
        'last_name',
        'user_type',
        'school.name',  # Ensure the correct path is used for nested objects
        'college.name',  # Ensure the correct path is used for nested objects
        'faculty.name',  # Ensure the correct path is used for nested objects
        'programme.name',  # Ensure the correct path is used for nested objects
        'primary_contact',
        'secondary_contact',
        'residence',
    )
    
    filter_fields = {
        'username': 'username.raw',
        'email': 'email.raw',
        'first_name': 'first_name.raw',
        'middle_name': 'middle_name.raw',
        'last_name': 'last_name.raw',
        'user_type': 'user_type.raw',
        'school.id': 'school.id',
        'college.id': 'college.id',
        'faculty.id': 'faculty.id',
        'programme.id': 'programme.id',
        'primary_contact': 'primary_contact.raw',
        'secondary_contact': 'secondary_contact.raw',
        'residence': 'residence.raw',
    }
'''