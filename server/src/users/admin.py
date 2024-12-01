from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.contrib.auth.decorators import user_passes_test
from django.urls import path, reverse
from django.http import HttpResponseRedirect
from .models import User, School, Programme, College, Faculty, Course, AcademicYear, Grade, Term

class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('username', 'email', 'first_name', 'middle_name', 'last_name', 'user_type', 'password1', 'password2', 'image', 'user_school_id', 'index_number', 'primary_contact', 'secondary_contact', 'residence', 'bio')

class CustomUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = User
        fields = ('username', 'email', 'first_name', 'middle_name', 'last_name', 'user_type', 'is_admin', 'is_curio_admin', 'is_staff', 'password', 'user_school_id', 'index_number', 'image', 'college', 'faculty', 'programme', 'courses', 'primary_contact', 'secondary_contact', 'residence', 'bio')

class UserAdmin(BaseUserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = User

    list_display = ('username', 'email', 'first_name', 'middle_name', 'last_name', 'user_type', 'is_curio_admin', 'is_admin', 'is_staff', 'school', 'college', 'faculty', 'programme', 'user_school_id', 'index_number', 'primary_contact', 'secondary_contact', 'residence', 'bio', 'get_courses')
    list_filter = ('user_type', 'is_admin', 'is_curio_admin', 'is_staff')
    fieldsets = (
        (None, {'fields': ('username', 'email', 'first_name', 'middle_name', 'last_name', 'password', 'image', 'school', 'college', 'faculty', 'programme', 'courses', 'user_school_id', 'index_number', 'primary_contact', 'secondary_contact', 'residence', 'bio')}),
        ('Permissions', {'fields': ('user_type', 'is_admin', 'is_curio_admin', 'is_staff')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'first_name', 'middle_name', 'last_name', 'user_type', 'password1', 'password2', 'is_admin', 'is_curio_admin', 'is_staff', 'image', 'school', 'college', 'faculty', 'programme', 'courses', 'user_school_id', 'index_number', 'primary_contact', 'secondary_contact', 'residence', 'bio')}
        ),
    )
    search_fields = ('username', 'email', 'first_name', 'middle_name', 'last_name',  'school',)
    ordering = ('email', 'first_name', 'middle_name', 'last_name',)

    def get_courses(self, obj):
        return ", ".join([course.name for course in obj.courses.all()])

    get_courses.short_description = 'Courses'

class SchoolAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'school_type', 'created_by', 'created_on')
    list_filter = ('school_type',)
    search_fields = ('name', 'address')
    ordering = ('name',)

class CollegeAdmin(admin.ModelAdmin):
    list_display = ('name', 'school', 'created_by', 'created_on') 
    list_filter = ('school',) 
    search_fields = ('name', 'school__name', ) 
    ordering = ('name',)

class FacultyAdmin(admin.ModelAdmin):
    list_display = ('name', 'school', 'created_by', 'created_on') 
    list_filter = ('school',) 
    search_fields = ('name', 'school__name', ) 
    ordering = ('name',)

class ProgrammeAdmin(admin.ModelAdmin):
    list_display = ('name', 'school', 'created_by', 'created_on') 
    list_filter = ('school',) 
    search_fields = ('name', 'school__name', ) 
    ordering = ('name',)

class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'school', 'code', 'grade', 'term', 'created_by', 'created_on')
    list_filter = ('school','grade', 'term',)
    search_fields = ('name', 'code', 'school__name','grade__grade', 'term__term')
    ordering = ('name',)

class AcademicYearAdmin(admin.ModelAdmin):
    list_display = ('year', 'school', 'created_by', 'created_on')
    list_filter = ('school',)
    search_fields = ('year', 'school__name')
    ordering = ('year',)

class GradeAdmin(admin.ModelAdmin):
    list_display = ('grade', 'school', 'created_by', 'created_on')
    list_filter = ('school',)
    search_fields = ('grade', 'school__name')
    ordering = ('grade',)

class TermAdmin(admin.ModelAdmin):
    list_display = ('term', 'school', 'start_date', 'end_date', 'created_by', 'created_on')
    list_filter = ('school', 'start_date', 'end_date')
    search_fields = ('term', 'school__name')
    ordering = ('term',)


admin.site.register(User, UserAdmin)
admin.site.register(School, SchoolAdmin)
admin.site.register(College, CollegeAdmin)
admin.site.register(Faculty, FacultyAdmin)
admin.site.register(Programme, ProgrammeAdmin)
admin.site.register(Course, CourseAdmin)
admin.site.register(AcademicYear, AcademicYearAdmin)
admin.site.register(Grade, GradeAdmin)
admin.site.register(Term, TermAdmin)

def is_curio_admin(user):
    return user.is_authenticated and user.is_curio_admin

@user_passes_test(is_curio_admin, login_url='/admin/login/')
def custom_admin_view(request):
    return HttpResponseRedirect(reverse('admin:index'))

admin.site.site_header = "Curio Admin Portal"
admin.site.site_title = "Curio Admin Portal"
admin.site.index_title = "Welcome to the Curio Admin Portal"
