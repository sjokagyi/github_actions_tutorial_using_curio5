from rest_framework import routers
from django.urls import path
from .viewsets import AnalyticsReportViewSet, AthenaQueryViewSet, StudentAnalyticsViewSet
app_name = "analytics"

router = routers.DefaultRouter()
router.register('reports', AnalyticsReportViewSet, basename='report')
router.register('athena', AthenaQueryViewSet, basename='athena')
router.register('student-analytics', StudentAnalyticsViewSet, basename='student-analytics')