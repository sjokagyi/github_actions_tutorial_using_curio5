from rest_framework import viewsets, status
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Resource, Comment, Tag, TestUpload
from .serializers import ResourceSerializer, CommentSerializer, TagSerializer, TestUploadSerializer, ResourceDocumentSerializer
from .documents import ResourceDocument
from .tasks import process_upload
from .tasks import add
from .pagination import ElasticsearchPagination
from users.models import School, Course
from django_elasticsearch_dsl_drf.viewsets import DocumentViewSet
from rest_framework.permissions import IsAuthenticated
from django_elasticsearch_dsl_drf.filter_backends import (
    FilteringFilterBackend,
    OrderingFilterBackend,
    CompoundSearchFilterBackend,
    FunctionalSuggesterFilterBackend,
)
from rest_framework.decorators import action
from rest_framework.response import Response
from elasticsearch_dsl.query import MultiMatch


class TestUploadViewSet(viewsets.ModelViewSet):
    queryset = TestUpload.objects.all()
    serializer_class = TestUploadSerializer
    permission_classes = [IsAuthenticated]

class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_curio_admin:
            return Resource.objects.all()
        return Resource.objects.filter(school=user.school)

    def perform_create(self, serializer):
        school = self.request.user.school
        course = self.request.user.course
        serializer.save(uploaded_by=self.request.user, school=school, course=course)
        process_upload.delay(resource.id)  # Trigger the Celery task
        return resource

    @action(detail=False, methods=['get'], url_path='test-celery')
    def test_celery(self, request):
        result = add.delay(4, 4)  # Call the Celery task
        return Response({'task_id': result.id}, status=status.HTTP_200_OK)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        resource = get_object_or_404(Resource, pk=self.kwargs['resource_pk'])
        serializer.save(user=self.request.user, resource=resource)

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]


class ResourceDocumentViewSet(DocumentViewSet):
    document = ResourceDocument
    serializer_class = ResourceDocumentSerializer
    pagination_class = ElasticsearchPagination  # Use ResourceDocumentSerializer
    lookup_field = 'id'


    filter_backends = [
        CompoundSearchFilterBackend,
        FilteringFilterBackend,
        OrderingFilterBackend,
        FunctionalSuggesterFilterBackend,
    ]

    search_fields = (
        'title',
        'description',
        'tags.name',
        'uploaded_by.username',
        'course.name',
        'school.name',
    )

    functional_suggester_fields = {
        'title_suggest': {
            'field': 'title_suggest',
            'suggesters': [
                'term',
                'phrase',
                'completion',
            ],
        },
        'description_suggest': {
            'field': 'description_suggest',
            'suggesters': [
                'term',
                'phrase',
                'completion',
            ],
        },
    }

    # Define filtering fields
    filter_fields = {
        'resource_type': 'resource_type',
        'upload_date': 'upload_date',
    }


    # Define ordering fields
    ordering_fields = {
        'upload_date': 'upload_date',
    }

    ordering = ('upload_date',)

    @action(detail=False, methods=['get'], url_path='search')
    def search(self, request):
        query = request.query_params.get('q', None)
        if query:
            search = self.document.search()
            multi_match_query = MultiMatch(
                query=query,
                fields=['title', 'description', 'tags.name', 'uploaded_by.username', 'course.name', 'school.name'],
                type='best_fields'
            )
            search = search.query(multi_match_query)
            response = search.execute()
            serializer = self.get_serializer(response.hits, many=True)
            return Response(serializer.data)
        else:
            return Response({"error": "Query parameter 'q' is required."}, status=400)