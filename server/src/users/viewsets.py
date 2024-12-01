import requests
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.decorators import permission_classes
from django.conf import settings
from django.shortcuts import redirect
from django.http import HttpResponse
from django.contrib.auth import authenticate, login
from .models import User, School, College, Faculty, Programme, Course, AcademicYear, Grade, Term 
from .serializers import (
    UserSerializer, 
    SchoolSerializer, 
    RegistrationSerializer, 
    SchoolAdminRegistrationSerializer, 
    SchoolAdminStudentCreationSerializer,
    SchoolAdminTeacherCreationSerializer, 
    RegistrationForSchoolAdminSerializer, 
    CollegeSerializer, 
    FacultySerializer, 
    ProgrammeSerializer, 
    CourseSerializer, 
    AcademicYearSerializer, 
    GradeSerializer, 
    TermSerializer,
    CustomTokenObtainPairSerializer
)
from .permissions import IsCurioAdmin, IsSchoolAdmin, IsUserOwnerOrGetAndPostOnly

import logging

logger = logging.getLogger(__name__)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsUserOwnerOrGetAndPostOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['user_school_id', 'index_number', 'first_name', 'middle_name', 'last_name', 'email', 'college__name', 'faculty__name', 'programme__name']

    def get_serializer_context(self):
        context = super(UserViewSet, self).get_serializer_context()
        context.update({"request": self.request})
        return context

    @action(detail=False, methods=['post'], permission_classes=[AllowAny], url_path='register')
    def register(self, request):
        serializer = RegistrationSerializer(data=request.data, context=self.get_serializer_context())
        if serializer.is_valid():
            user = serializer.save()
            return Response({"msg": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny], url_path='register-school-admin')
    def register_school_admin(self, request):
        serializer = SchoolAdminRegistrationSerializer(data=request.data, context=self.get_serializer_context())
        if serializer.is_valid():
            user = serializer.save()
            user = authenticate(email=user.email, password=request.data['password'])  # Using email for authentication
            if user:
                login(request, user)
                refresh = RefreshToken.for_user(user)
                return Response({
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "user_type": user.user_type
                }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny], url_path='login')
    def login(self, request):
        serializer = CustomTokenObtainPairSerializer(data=request.data, context=self.get_serializer_context())
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated], url_path='logout')
    def logout(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny], url_path='create-school-admin')
    def create_school_admin(self, request):
        data = request.data.copy()
        data['user_type'] = User.SCHOOL_ADMIN
        data['is_admin'] = True
        data['school'] = request.user.school.id
        serializer = RegistrationForSchoolAdminSerializer(data=data, context=self.get_serializer_context())
        if serializer.is_valid():
            serializer.save()
            return Response({"msg": "School Admin created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put', 'patch'], permission_classes=[AllowAny], url_path='edit-school-admin')
    def edit_school_admin(self, request, pk=None):
        try:
            school_admin = User.objects.get(pk=pk, user_type=User.SCHOOL_ADMIN)
            serializer = UserSerializer(school_admin, data=request.data, partial=True, context=self.get_serializer_context())
            if serializer.is_valid():
                serializer.save()
                return Response({"msg": "School Admin account updated successfully"}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "School Admin not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated], url_path='admins-by-school')
    def admins_by_school(self, request):
        school_admin = request.user
        if not school_admin.school:
            return Response({"error": "No school associated with the logged-in admin"}, status=status.HTTP_400_BAD_REQUEST)

        queryset = User.objects.filter(school=school_admin.school, user_type=User.SCHOOL_ADMIN)
        search_query = request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(user_school_id__icontains=search_query) |
                Q(index_number__icontains=search_query) |
                Q(first_name__icontains=search_query) |
                Q(middle_name__icontains=search_query) |
                Q(last_name__icontains=search_query) |
                Q(email__icontains=search_query) |
                Q(college__name__icontains=search_query) |
                Q(faculty__name__icontains=search_query) |
                Q(programme__name__icontains=search_query)
            )
        serializer = UserSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)


    @action(detail=True, methods=['delete'], permission_classes=[AllowAny], url_path='delete-school-admin')
    def delete_school_admin(self, request, pk=None):
        try:
            school_admin = User.objects.get(pk=pk, user_type=User.SCHOOL_ADMIN)
            school_admin.delete()
            return Response({"msg": "School Admin deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({"error": "School Admin not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny], url_path='create-teacher')
    def create_teacher(self, request):
        data = request.data.copy()
        data['school'] = request.user.school.id
        serializer = SchoolAdminTeacherCreationSerializer(data=data, context=self.get_serializer_context())
        if serializer.is_valid():
            serializer.save()
            return Response({"msg": "Teacher created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put', 'patch'], permission_classes=[AllowAny], url_path='edit-teacher')
    def edit_teacher(self, request, pk=None):
        try:
            teacher = User.objects.get(pk=pk, user_type=User.TEACHER)
            serializer = UserSerializer(teacher, data=request.data, partial=True, context=self.get_serializer_context())
            if serializer.is_valid():
                serializer.save()
                return Response({"msg": "Teacher account updated successfully"}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "Teacher not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated], url_path='teachers-by-school')
    def teachers_by_school(self, request):
        school_admin = request.user
        if not school_admin.school:
            return Response({"error": "No school associated with the logged-in admin"}, status=status.HTTP_400_BAD_REQUEST)

        queryset = User.objects.filter(school=school_admin.school, user_type=User.TEACHER)
        search_query = request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(user_school_id__icontains=search_query) |
                Q(index_number__icontains=search_query) |
                Q(first_name__icontains=search_query) |
                Q(middle_name__icontains=search_query) |
                Q(last_name__icontains=search_query) |
                Q(email__icontains=search_query) |
                Q(college__name__icontains=search_query) |
                Q(faculty__name__icontains=search_query) |
                Q(programme__name__icontains=search_query)
            )
        serializer = UserSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['delete'], permission_classes=[AllowAny], url_path='delete-teacher')
    def delete_teacher(self, request, pk=None):
        try:
            teacher = User.objects.get(pk=pk, user_type=User.TEACHER)
            teacher.delete()
            return Response({"msg": "Teacher deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({"error": "Teacher not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny], url_path='create-student')
    def create_student(self, request):
        data = request.data.copy()
        data['school'] = request.user.school.id
        serializer = SchoolAdminStudentCreationSerializer(data=data, context=self.get_serializer_context())
        if serializer.is_valid():
            serializer.save()
            return Response({"msg": "Student created successfully"}, status=status.HTTP_201_CREATED)
        # Debugging: Log the serializer errors
        print("Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put', 'patch'], permission_classes=[AllowAny], url_path='edit-student')
    def edit_student(self, request, pk=None):
        try:
            student = User.objects.get(pk=pk, user_type=User.STUDENT)
            serializer = UserSerializer(student, data=request.data, partial=True, context=self.get_serializer_context())
            if serializer.is_valid():
                serializer.save()
                return Response({"msg": "Student account updated successfully"}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated], url_path='students-by-school')
    def students_by_school(self, request):
        school_admin = request.user
        if not school_admin.school:
            return Response({"error": "No school associated with the logged-in admin"}, status=status.HTTP_400_BAD_REQUEST)

        queryset = User.objects.filter(school=school_admin.school, user_type=User.STUDENT)
        search_query = request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(user_school_id__icontains=search_query) |
                Q(index_number__icontains=search_query) |
                Q(first_name__icontains=search_query) |
                Q(middle_name__icontains=search_query) |
                Q(last_name__icontains=search_query) |
                Q(email__icontains=search_query) |
                Q(college__name__icontains=search_query) |
                Q(faculty__name__icontains=search_query) |
                Q(programme__name__icontains=search_query)
            )
        serializer = UserSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['delete'], permission_classes=[IsAuthenticated], url_path='delete-student')
    def delete_student(self, request, pk=None):
        logger.debug(f"Attempting to delete student with ID: {pk}")
        try:
            student = User.objects.get(pk=pk, user_type=User.STUDENT)
            student.delete()
            logger.debug(f"Deleted student with ID: {pk}")
            return Response({"msg": "Student deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            logger.error(f"Student not found with ID: {pk}")
            return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)

    #Courses

    @action(detail=False, methods=['get'], permission_classes=[AllowAny], url_path='student_courses')
    def student_courses(self, request):
        student = request.user
        if not student.is_authenticated or not hasattr(student, 'programme'):
            return Response({"error": "User is not authenticated or does not have a programme"}, status=status.HTTP_401_UNAUTHORIZED)

        programme = student.programme
        courses = Course.objects.filter(programmes=programme)
        serializer = CourseSerializer(courses, many=True, context={'request': request})
        return Response(serializer.data)

class SchoolViewSet(viewsets.ModelViewSet):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [IsUserOwnerOrGetAndPostOnly]

    def get_serializer_context(self):
        context = super(SchoolViewSet, self).get_serializer_context()
        context.update({"request": self.request})
        return context

    @action(detail=False, methods=['post'], permission_classes=[IsUserOwnerOrGetAndPostOnly], url_path='create-school')
    def create_school(self, request):
        serializer = SchoolSerializer(data=request.data, context=self.get_serializer_context())
        if serializer.is_valid():
            if request.user.user_type == User.CURIO_ADMIN:
                school = serializer.save(created_by=None)
            else:
                school = serializer.save(created_by=request.user)
                if request.user.user_type == User.SCHOOL_ADMIN:
                    request.user.school = school
                    request.user.save()
            return Response({"msg": "School created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        user = self.request.user
        if user.user_type == User.CURIO_ADMIN:
            serializer.save(created_by=None)
        else:
            serializer.save(created_by=user)

    @action(detail=True, methods=['put', 'patch'], permission_classes=[AllowAny], url_path='edit-school')
    def edit_school(self, request, pk=None):
        try:
            school = School.objects.get(pk=pk)
            serializer = SchoolSerializer(school, data=request.data, partial=True, context=self.get_serializer_context())
            if serializer.is_valid():
                serializer.save()
                return Response({"msg": "School updated successfully"}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except School.DoesNotExist:
            return Response({"error": "School not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['delete'], permission_classes=[AllowAny], url_path='delete-school')
    def delete_school(self, request, pk=None):
        try:
            school = School.objects.get(pk=pk)
            school.delete()
            return Response({"msg": "School deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except School.DoesNotExist:
            return Response({"error": "School not found"}, status=status.HTTP_404_NOT_FOUND)

class CollegeViewSet(viewsets.ModelViewSet):
    queryset = College.objects.all()
    serializer_class = CollegeSerializer
    permission_classes = [IsUserOwnerOrGetAndPostOnly]

    def get_serializer_context(self):
        context = super(CollegeViewSet, self).get_serializer_context()
        context.update({"request": self.request})
        return context

    def get_queryset(self):
        user = self.request.user
        if user.user_type == User.SCHOOL_ADMIN:
            return College.objects.filter(school=user.school)
        return College.objects.none()  # Return empty queryset for non-school_admin users

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(created_by=user, school=user.school)

    @action(detail=True, methods=['get'], url_path='faculties', permission_classes=[AllowAny])
    def faculties(self, request, pk=None):
        try:
            college = self.get_object()
            faculties = college.faculties.all()
            serializer = FacultySerializer(faculties, many=True, context=self.get_serializer_context())
            return Response(serializer.data)
        except College.DoesNotExist:
            return Response({"error": "College not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated], url_path='create-college')
    def create_college(self, request):
        data = request.data.copy()
        data['created_by'] = request.user.id
        data['school'] = request.user.school.id  # Ensure the school ID is set
        serializer = CollegeSerializer(data=data, context=self.get_serializer_context())
        if serializer.is_valid():
            serializer.save()
            return Response({"msg": "College created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put', 'patch'], permission_classes=[AllowAny], url_path='edit-college')
    def edit_college(self, request, pk=None):
        try:
            college = College.objects.get(pk=pk)
            serializer = CollegeSerializer(college, data=request.data, partial=True, context=self.get_serializer_context())
            if serializer.is_valid():
                serializer.save()
                return Response({"msg": "College updated successfully"}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except College.DoesNotExist:
            return Response({"error": "College not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['delete'], permission_classes=[AllowAny], url_path='delete-college')
    def delete_college(self, request, pk=None):
        try:
            college = College.objects.get(pk=pk)
            college.delete()
            return Response({"msg": "College deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except College.DoesNotExist:
            return Response({"error": "College not found"}, status=status.HTTP_404_NOT_FOUND)

class FacultyViewSet(viewsets.ModelViewSet):
    queryset = Faculty.objects.all()
    serializer_class = FacultySerializer
    permission_classes = [IsUserOwnerOrGetAndPostOnly]

    def get_serializer_context(self):
        context = super(FacultyViewSet, self).get_serializer_context()
        context.update({"request": self.request})
        return context

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(created_by=user, school=user.school)

    def get_queryset(self):
        user = self.request.user
        if user.user_type == User.SCHOOL_ADMIN:
            return Faculty.objects.filter(school=user.school)
        return Faculty.objects.none()  # Return empty queryset for non-school_admin users

    @action(detail=True, methods=['get'], url_path='programmes', permission_classes=[AllowAny])
    def programmes(self, request, pk=None):
        try:
            faculty = self.get_object()
            programmes = faculty.programme.all()
            serializer = ProgrammeSerializer(programmes, many=True, context=self.get_serializer_context())
            return Response(serializer.data)
        except Faculty.DoesNotExist:
            return Response({"error": "Faculty not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny], url_path='create-faculty')
    def create_faculty(self, request):
        data = request.data.copy()
        data['created_by'] = request.user.id
        data['school'] = request.user.school.id
        serializer = FacultySerializer(data=data, context=self.get_serializer_context())
        if serializer.is_valid():
            serializer.save()
            return Response({"msg": "Faculty created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put', 'patch'], permission_classes=[AllowAny], url_path='edit-faculty')
    def edit_faculty(self, request, pk=None):
        try:
            faculty = Faculty.objects.get(pk=pk)
            serializer = FacultySerializer(faculty, data=request.data, partial=True, context=self.get_serializer_context())
            if serializer.is_valid():
                serializer.save()
                return Response({"msg": "Faculty updated successfully"}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Faculty.DoesNotExist:
            return Response({"error": "Faculty not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['delete'], permission_classes=[AllowAny], url_path='delete-faculty')
    def delete_faculty(self, request, pk=None):
        try:
            faculty = Faculty.objects.get(pk=pk)
            faculty.delete()
            return Response({"msg": "Faculty deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Faculty.DoesNotExist:
            return Response({"error": "Faculty not found"}, status=status.HTTP_404_NOT_FOUND)

class ProgrammeViewSet(viewsets.ModelViewSet):
    queryset = Programme.objects.all()
    serializer_class = ProgrammeSerializer
    permission_classes = [IsUserOwnerOrGetAndPostOnly]

    def get_serializer_context(self):
        context = super(ProgrammeViewSet, self).get_serializer_context()
        context.update({"request": self.request})
        return context

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(created_by=user, school=user.school)

    def get_queryset(self):
        user = self.request.user
        if user.user_type == User.SCHOOL_ADMIN:
            return Programme.objects.filter(school=user.school)
        return Programme.objects.none()  # Return empty queryset for non-school_admin users

    @action(detail=True, methods=['get'], url_path='courses', permission_classes=[AllowAny])
    def courses(self, request, pk=None):
        try:
            programme = self.get_object()
            courses = programme.courses.all()
            serializer = CourseSerializer(courses, many=True, context=self.get_serializer_context())
            return Response(serializer.data)
        except Programme.DoesNotExist:
            return Response({"error": "Programme not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['get'], url_path='programmes', permission_classes=[AllowAny])
    def programmes(self, request, pk=None):
        try:
            faculty = self.get_object()
            programmes = faculty.programme.all()
            serializer = ProgrammeSerializer(programmes, many=True, context=self.get_serializer_context())
            return Response(serializer.data)
        except Faculty.DoesNotExist:
            return Response({"error": "Faculty not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny], url_path='create-programme')
    def create_programme(self, request):
        data = request.data.copy()
        data['created_by'] = request.user.id
        data['school'] = request.user.school.id
        serializer = ProgrammeSerializer(data=data, context=self.get_serializer_context())
        if serializer.is_valid():
            serializer.save()
            return Response({"msg": "Programme created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put', 'patch'], permission_classes=[AllowAny], url_path='edit-programme')
    def edit_programme(self, request, pk=None):
        try:
            programme = Programme.objects.get(pk=pk)
            serializer = ProgrammeSerializer(programme, data=request.data, partial=True, context=self.get_serializer_context())
            if serializer.is_valid():
                serializer.save()
                return Response({"msg": "Programme updated successfully"}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Programme.DoesNotExist:
            return Response({"error": "Programme not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['delete'], permission_classes=[AllowAny], url_path='delete-programme')
    def delete_programme(self, request, pk=None):
        try:
            programme = Programme.objects.get(pk=pk)
            programme.delete()
            return Response({"msg": "Programme deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Programme.DoesNotExist:
            return Response({"error": "Programme not found"}, status=status.HTTP_404_NOT_FOUND)

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsUserOwnerOrGetAndPostOnly]

    def get_serializer_context(self):
        context = super(CourseViewSet, self).get_serializer_context()
        context.update({"request": self.request})
        return context

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(created_by=user, school=user.school)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny], url_path='create-course')
    def create_course(self, request):
        data = request.data.copy()
        data['created_by'] = request.user.id
        data['school'] = request.user.school.id
        serializer = CourseSerializer(data=data, context=self.get_serializer_context())
        if serializer.is_valid():
            serializer.save()
            return Response({"msg": "Course created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put', 'patch'], permission_classes=[AllowAny], url_path='edit-course')
    def edit_course(self, request, pk=None):
        try:
            course = Course.objects.get(pk=pk)
            serializer = CourseSerializer(course, data=request.data, partial=True, context=self.get_serializer_context())
            if serializer.is_valid():
                serializer.save()
                return Response({"msg": "Course updated successfully"}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['delete'], permission_classes=[AllowAny], url_path='delete-course')
    def delete_course(self, request, pk=None):
        try:
            course = Course.objects.get(pk=pk)
            course.delete()
            return Response({"msg": "Course deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

class AcademicYearViewSet(viewsets.ModelViewSet):
    queryset = AcademicYear.objects.all()
    serializer_class = AcademicYearSerializer
    permission_classes = [IsUserOwnerOrGetAndPostOnly]

    def get_serializer_context(self):
        context = super(AcademicYearViewSet, self).get_serializer_context()
        context.update({"request": self.request})
        return context

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(created_by=user, school=user.school)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny], url_path='create-academicyear')
    def create_academicyear(self, request):
        data = request.data.copy()
        data['created_by'] = request.user.id
        data['school'] = request.user.school.id
        serializer = AcademicYearSerializer(data=data, context=self.get_serializer_context())
        if serializer.is_valid():
            serializer.save()
            return Response({"msg": "Academic Year created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put', 'patch'], permission_classes=[AllowAny], url_path='edit-academicyear')
    def edit_academicyear(self, request, pk=None):
        try:
            academicyear = AcademicYear.objects.get(pk=pk)
            serializer = AcademicYearSerializer(academicyear, data=request.data, partial=True, context=self.get_serializer_context())
            if serializer.is_valid():
                serializer.save()
                return Response({"msg": "Academic Year updated successfully"}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except AcademicYear.DoesNotExist:
            return Response({"error": "Academic Year not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['delete'], permission_classes=[AllowAny], url_path='delete-academicyear')
    def delete_academicyear(self, request, pk=None):
        try:
            academicyear = AcademicYear.objects.get(pk=pk)
            academicyear.delete()
            return Response({"msg": "Academic Year deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except AcademicYear.DoesNotExist:
            return Response({"error": "Academic Year not found"}, status=status.HTTP_404_NOT_FOUND)

class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    permission_classes = [IsUserOwnerOrGetAndPostOnly]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == User.SCHOOL_ADMIN:
            return Grade.objects.filter(school=user.school)
        return Grade.objects.none()  # Return empty queryset for non-school_admin users

    def get_serializer_context(self):
        context = super(GradeViewSet, self).get_serializer_context()
        context.update({"request": self.request})
        return context

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(created_by=user, school=user.school)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny], url_path='create-grade')
    def create_grade(self, request):
        data = request.data.copy()
        data['created_by'] = request.user.id
        data['school'] = request.user.school.id
        serializer = GradeSerializer(data=data, context=self.get_serializer_context())
        if serializer.is_valid():
            serializer.save()
            return Response({"msg": "Grade created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put', 'patch'], permission_classes=[AllowAny], url_path='edit-grade')
    def edit_grade(self, request, pk=None):
        try:
            grade = Grade.objects.get(pk=pk)
            serializer = GradeSerializer(grade, data=request.data, partial=True, context=self.get_serializer_context())
            if serializer.is_valid():
                serializer.save()
                return Response({"msg": "Grade updated successfully"}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Grade.DoesNotExist:
            return Response({"error": "Grade not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['delete'], permission_classes=[AllowAny], url_path='delete-grade')
    def delete_grade(self, request, pk=None):
        try:
            grade = Grade.objects.get(pk=pk)
            grade.delete()
            return Response({"msg": "Grade deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Grade.DoesNotExist:
            return Response({"error": "Grade not found"}, status=status.HTTP_404_NOT_FOUND)

class TermViewSet(viewsets.ModelViewSet):
    queryset = Term.objects.all()
    serializer_class = TermSerializer
    permission_classes = [IsUserOwnerOrGetAndPostOnly]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == User.SCHOOL_ADMIN:
            return Term.objects.filter(school=user.school)
        return Term.objects.none()  # Return empty queryset for non-school_admin users

    def get_serializer_context(self):
        context = super(TermViewSet, self).get_serializer_context()
        context.update({"request": self.request})
        return context

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(created_by=user, school=user.school)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny], url_path='create-term')
    def create_term(self, request):
        data = request.data.copy()
        data['created_by'] = request.user.id
        data['school'] = request.user.school.id
        serializer = TermSerializer(data=data, context=self.get_serializer_context())
        if serializer.is_valid():
            serializer.save()
            return Response({"msg": "Term created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put', 'patch'], permission_classes=[AllowAny], url_path='edit-term')
    def edit_term(self, request, pk=None):
        try:
            term = Term.objects.get(pk=pk)
            serializer = TermSerializer(term, data=request.data, partial=True, context=self.get_serializer_context())
            if serializer.is_valid():
                serializer.save()
                return Response({"msg": "Term updated successfully"}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Term.DoesNotExist:
            return Response({"error": "Term not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['delete'], permission_classes=[AllowAny], url_path='delete-term')
    def delete_term(self, request, pk=None):
        try:
            term = Term.objects.get(pk=pk)
            term.delete()
            return Response({"msg": "Term deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Term.DoesNotExist:
            return Response({"error": "Term not found"}, status=status.HTTP_404_NOT_FOUND)
