from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import AnalyticsReport
from .serializers import AnalyticsReportSerializer
from .utils import execute_athena_query
from django.shortcuts import get_object_or_404
from users.models import User

class AnalyticsReportViewSet(viewsets.ViewSet):
    def list(self, request):
        # Query Athena and get the data
        report_data = execute_athena_query('SELECT * FROM curioanalyticsdb2.curioanalyticstable_clean LIMIT 10')
        if 'error' in report_data:
            return Response(report_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(report_data, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = AnalyticsReportSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AthenaQueryViewSet(viewsets.ViewSet):
    def list(self, request):
        query = request.query_params.get('query', 'SELECT * FROM curioanalyticsdb2.curioanalyticstable_clean LIMIT 10')
        result = execute_athena_query(query)
        if 'error' in result:
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(result, status=status.HTTP_200_OK)

class StudentAnalyticsViewSet(viewsets.ViewSet):
    def list(self, request):
        user = request.user
        if not user.is_authenticated or user.user_type != 'student':
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

        # Example query to get the student's scores
        student_id = user.id
        query = f"""
        SELECT test_id, AVG(total_marks) as average_score
        FROM curioanalyticsdb2.curioanalyticstable_clean
        WHERE student_id = {student_id}
        GROUP BY test_id;
        """

        result = execute_athena_query(query)
        if 'error' in result:
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(result, status=status.HTTP_200_OK)
