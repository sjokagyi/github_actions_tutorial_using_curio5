import os
from django.contrib.auth.models import AbstractUser, BaseUserManager, Group, Permission
from django.db import models
from django.utils.deconstruct import deconstructible

@deconstructible
class GenerateProfileImagePath:
    def __call__(self, instance, filename):
        ext = filename.split('.')[-1]
        path = f'media/accounts/{instance.id}/images/'
        name = f'profile_image.{ext}'
        return os.path.join(path, name)

user_profile_image_path = GenerateProfileImagePath()

class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_admin', True)
        extra_fields.setdefault('is_curio_admin', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(username, email, password, **extra_fields)

class User(AbstractUser):
    CURIO_ADMIN = 'curio_admin'
    SCHOOL_ADMIN = 'school_admin'
    TEACHER = 'teacher'
    STUDENT = 'student'
    
    USER_TYPE_CHOICES = [
        (CURIO_ADMIN, 'Curio Admin'),
        (SCHOOL_ADMIN, 'School Admin'),
        (TEACHER, 'Teacher'),
        (STUDENT, 'Student'),
    ]

    email = models.EmailField(unique=True)  # Ensure the email field is unique
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    is_admin = models.BooleanField(default=False)
    is_curio_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False) 
    school = models.ForeignKey('School', on_delete=models.SET_NULL, null=True, blank=True)
    college = models.ForeignKey('College', on_delete=models.SET_NULL, null=True, blank=True)
    faculty = models.ForeignKey('Faculty', on_delete=models.SET_NULL, null=True, blank=True)
    programme = models.ForeignKey('Programme', on_delete=models.SET_NULL, null=True, blank=True, related_name='students')
    courses = models.ManyToManyField('Course', related_name='user_courses', blank=True)
    
    first_name = models.CharField(max_length=20, blank = True)
    middle_name = models.CharField(max_length=20, blank = True)
    last_name = models.CharField(max_length=20, blank = True)
    user_school_id = models.PositiveIntegerField(null=True, blank=True)
    index_number = models.PositiveIntegerField(null=True, blank=True)
    image = models.FileField(upload_to=user_profile_image_path, blank=True, null=True)
    primary_contact = models.CharField(max_length=14, blank=True, null=True)
    secondary_contact = models.CharField(max_length=14, blank=True, null=True)
    residence = models.CharField(max_length=100, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)

    groups = models.ManyToManyField(Group, related_name='custom_user_set')
    user_permissions = models.ManyToManyField(Permission, related_name='custom_user_set_permissions')

    USERNAME_FIELD = 'email'  # Set the USERNAME_FIELD to email
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    class Meta:
        unique_together = [('school', 'user_school_id'), ('school', 'index_number')]

    def save(self, *args, **kwargs):
        if self.is_curio_admin:
            self.user_type = self.CURIO_ADMIN
        elif self.is_admin:
            self.user_type = self.SCHOOL_ADMIN
        elif self.is_staff:
            self.user_type = self.TEACHER
        else:
            self.user_type = self.STUDENT
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username

    @property
    def is_staff_member(self):
        return self.is_admin or self.is_curio_admin or self.user_type in [self.SCHOOL_ADMIN, self.TEACHER]

class School(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField()
    school_type = models.CharField(max_length=20, choices=[('K12', 'K12'), ('Tertiary', 'Tertiary')])
    colleges = models.ManyToManyField('College', related_name='schools', blank=True)
    created_by = models.ForeignKey(User, related_name='created_schools', on_delete=models.CASCADE, null=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
 
class College(models.Model):
    name = models.CharField(max_length=255)
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='college_list')
    faculties = models.ManyToManyField('Faculty', related_name='colleges', blank=True)
    created_by = models.ForeignKey(User, related_name='created_colleges', on_delete=models.CASCADE, null=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Faculty(models.Model):
    name = models.CharField(max_length=255)
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='faculties')
    programme = models.ManyToManyField('Programme', related_name='faculties', blank=True)
    created_by = models.ForeignKey(User, related_name='created_faculties', on_delete=models.CASCADE, null=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Programme(models.Model):
    name = models.CharField(max_length=120)
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='programmes')
    courses = models.ManyToManyField('Course', related_name='programmes', blank=True)
    created_by = models.ForeignKey(User, related_name='created_programmes', on_delete=models.SET_NULL, null=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.name}'

class Course(models.Model):
    name = models.CharField(max_length=120)
    code = models.CharField(max_length=120)
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='courses')
    grade = models.ForeignKey('Grade', on_delete=models.SET_NULL, blank=True, null=True, related_name='courses')
    term = models.ForeignKey('Term', on_delete=models.SET_NULL, blank=True, null=True, related_name='terms')
    created_by = models.ForeignKey(User, related_name='created_courses',on_delete=models.SET_NULL, null=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.code} | {self.name}'

class AcademicYear(models.Model):
    year = models.CharField(max_length=120)
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='academicyears')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.year}'

class Grade(models.Model):
    grade = models.CharField(max_length=120)
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='grades')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.grade}'

class Term(models.Model):
    term = models.CharField(max_length=120)
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='terms')
    start_date = models.DateField()
    end_date = models.DateField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.term}'
