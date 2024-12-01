from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, School, College, Faculty, Programme, Course, AcademicYear, Grade, Term

class SchoolSerializer(serializers.ModelSerializer):
    colleges = serializers.PrimaryKeyRelatedField(many=True, queryset=College.objects.all(), required=False)

    class Meta:
        model = School
        fields = ['id', 'name', 'school_type', 'address', 'colleges', 'created_on']
        extra_kwargs = {'created_by': {'required': False}}

    def __init__(self, *args, **kwargs):
        context = kwargs.pop('context', None)
        super(SchoolSerializer, self).__init__(*args, **kwargs)
        if context:
            self.context.update(context)

class CollegeSerializer(serializers.ModelSerializer):
    school = serializers.PrimaryKeyRelatedField(queryset=School.objects.all(), required=False)
    faculties = serializers.PrimaryKeyRelatedField(many=True, queryset=Faculty.objects.all(), required=False)

    class Meta:
        model = College
        fields = ['url', 'id', 'name', 'school', 'faculties', 'created_by', 'created_on']
        extra_kwargs = {'created_by': {'required': False}, 'created_on': {'read_only': True}}

    def __init__(self, *args, **kwargs):
        context = kwargs.pop('context', None)
        super(CollegeSerializer, self).__init__(*args, **kwargs)
        if context:
            self.context.update(context)

class FacultySerializer(serializers.ModelSerializer):
    school = serializers.PrimaryKeyRelatedField(queryset=School.objects.all(), required=False)
    programmes = serializers.PrimaryKeyRelatedField(many=True, queryset=Programme.objects.all(), required=False)

    class Meta:
        model = Faculty
        fields = ['url', 'id', 'name', 'school', 'programmes', 'created_by', 'created_on']
        extra_kwargs = {'created_by': {'required': False}}

    def __init__(self, *args, **kwargs):
        context = kwargs.pop('context', None)
        super(FacultySerializer, self).__init__(*args, **kwargs)
        if context:
            self.context.update(context)

    def create(self, validated_data):
        programmes = validated_data.pop('programmes', [])
        faculty = Faculty.objects.create(**validated_data)
        faculty.programme.set(programmes)
        return faculty

class ProgrammeSerializer(serializers.ModelSerializer):
    school = serializers.PrimaryKeyRelatedField(queryset=School.objects.all(), required=False)
    courses = serializers.PrimaryKeyRelatedField(many=True, queryset=Course.objects.all(), required=False)

    class Meta:
        model = Programme
        fields = ['url', 'id', 'name', 'school', 'courses', 'created_by', 'created_on']
        extra_kwargs = {'created_by': {'required': False}}

    def __init__(self, *args, **kwargs):
        context = kwargs.pop('context', None)
        super(ProgrammeSerializer, self).__init__(*args, **kwargs)
        if context:
            self.context.update(context)

    def create(self, validated_data):
        courses = validated_data.pop('courses', [])
        programme = Programme.objects.create(**validated_data)
        programme.courses.set(courses)
        return programme

class CourseSerializer(serializers.ModelSerializer):
    school = serializers.PrimaryKeyRelatedField(queryset=School.objects.all(), required=False)
    programmes = serializers.HyperlinkedRelatedField(many=True, read_only=True, view_name='programme-detail')
    grades = serializers.PrimaryKeyRelatedField(queryset=Grade.objects.all(), required=False)
    terms = serializers.PrimaryKeyRelatedField(queryset=Term.objects.all(), required=False)

    class Meta:
        model = Course
        fields = ['url', 'id', 'name', 'code', 'school', 'programmes', 'grades', 'terms', 'created_by', 'created_on']
        extra_kwargs = {'created_by': {'required': False}}

    def __init__(self, *args, **kwargs):
        context = kwargs.pop('context', None)
        super(CourseSerializer, self).__init__(*args, **kwargs)
        if context:
            self.context.update(context)

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['created_by'] = user
        validated_data['school'] = user.school

        course = Course.objects.create(**validated_data)
        return course

class AcademicYearSerializer(serializers.ModelSerializer):
    school = serializers.PrimaryKeyRelatedField(queryset=School.objects.all(), required=False)

    class Meta:
        model = AcademicYear
        fields = ['url', 'id', 'school', 'year', 'created_by', 'created_on']
        extra_kwargs = {'created_by': {'required': False}}

    def __init__(self, *args, **kwargs):
        context = kwargs.pop('context', None)
        super(AcademicYearSerializer, self).__init__(*args, **kwargs)
        if context:
            self.context.update(context)

class GradeSerializer(serializers.ModelSerializer):
    school = serializers.PrimaryKeyRelatedField(queryset=School.objects.all(), required=False)

    class Meta:
        model = Grade
        fields = ['url', 'id', 'school', 'grade', 'created_by', 'created_on']
        extra_kwargs = {'created_by': {'required': False}}

    def __init__(self, *args, **kwargs):
        context = kwargs.pop('context', None)
        super(GradeSerializer, self).__init__(*args, **kwargs)
        if context:
            self.context.update(context)

class TermSerializer(serializers.ModelSerializer):
    school = serializers.PrimaryKeyRelatedField(queryset=School.objects.all(), required=False)

    class Meta:
        model = Term
        fields = ['url', 'id', 'term', 'school', 'start_date', 'end_date', 'created_by', 'created_on']
        extra_kwargs = {'created_by': {'required': False}}

    def __init__(self, *args, **kwargs):
        context = kwargs.pop('context', None)
        super(TermSerializer, self).__init__(*args, **kwargs)
        if context:
            self.context.update(context)

class UserSerializer(serializers.ModelSerializer):
    college = CollegeSerializer(read_only=True)
    faculty = FacultySerializer(read_only=True)
    programme = ProgrammeSerializer(read_only=True)
    courses = serializers.PrimaryKeyRelatedField(many=True, queryset=Course.objects.all(), required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'middle_name', 'last_name', 'user_type', 'is_admin', 'is_curio_admin', 'is_staff', 'school', 'college', 'faculty', 'programme', 'courses', 'image', 'user_school_id', 'index_number', 'primary_contact', 'secondary_contact', 'residence', 'bio']

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['user_type'] = user.user_type
        return token

    def validate(self, attrs):
        print("Attempting to authenticate user...")
        print("Provided email:", attrs.get("email"))
        print("Provided password:", attrs.get("password"))

        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        data['user_type'] = self.user.user_type
        print("User authenticated successfully:", self.user)
        return data

class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'middle_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class SchoolAdminRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'middle_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            middle_name=validated_data['middle_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            password=validated_data['password'],
            user_type=User.SCHOOL_ADMIN,  # Ensure the user type is set to School Admin
            school=None  # Ensure the school attribute is set to null
        )
        user.is_admin = True  # Ensure the user is granted admin permissions
        user.save()
        return user

class SchoolAdminStudentCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'first_name', 'middle_name', 
            'last_name', 'school', 'user_school_id', 'index_number', 'college', 
            'faculty', 'programme', 'primary_contact', 'secondary_contact', 'residence'
        ]
        extra_kwargs = {'password': {'write_only': True}}
        
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            middle_name=validated_data['middle_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            password=validated_data['password'],
            user_type=User.STUDENT,  
            school=validated_data['school'], 
            user_school_id=validated_data['user_school_id'],
            index_number=validated_data.get('index_number'),  
            college=validated_data.get('college'),
            faculty=validated_data.get('faculty'),
            programme=validated_data.get('programme'),
            primary_contact=validated_data.get('primary_contact', None),
            secondary_contact=validated_data.get('secondary_contact', None),
            residence=validated_data.get('residence', None)
        )
        user.save()
        return user

class SchoolAdminTeacherCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'first_name', 'middle_name', 'last_name', 
            'school', 'user_school_id', 'index_number', 'college', 'faculty', 'programme', 
            'courses', 'primary_contact', 'secondary_contact', 'residence'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        courses = validated_data.pop('courses', [])
        user = User.objects.create_user(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            middle_name=validated_data['middle_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            password=validated_data['password'],
            user_type=User.TEACHER,
            school=validated_data['school'],
            user_school_id=validated_data['user_school_id'],
            index_number=validated_data.get('index_number', None),  # Set index_number if provided
            college=validated_data.get('college'),
            faculty=validated_data.get('faculty'),
            programme=validated_data.get('programme'),
            primary_contact=validated_data.get('primary_contact'),
            secondary_contact=validated_data.get('secondary_contact'),
            residence=validated_data.get('residence')
        )
        user.courses.set(courses)
        user.is_staff = True
        user.save()
        return user

class RegistrationForSchoolAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'middle_name', 'last_name', 'user_school_id']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            middle_name=validated_data['middle_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            password=validated_data['password'],
            user_type=User.SCHOOL_ADMIN,
            user_school_id=validated_data['user_school_id']  # Ensure the user_school_id is set as provided
        )
        user.is_admin = True
        user.save()
        return user
