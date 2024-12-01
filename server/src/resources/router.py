from rest_framework import routers
from .viewsets import ResourceViewSet, CommentViewSet, TagViewSet, ResourceDocumentViewSet, TestUploadViewSet

app_name = "resources"

router = routers.DefaultRouter()
router.register('resources', ResourceViewSet)
router.register('comments', CommentViewSet)
router.register('tags', TagViewSet)
router.register('test-uploads', TestUploadViewSet)
router.register('search', ResourceDocumentViewSet, basename='resource-document')