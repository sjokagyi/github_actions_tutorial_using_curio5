from rest_framework import routers
from .viewsets import UserViewSet, SchoolViewSet, CollegeViewSet, FacultyViewSet, ProgrammeViewSet, CourseViewSet, AcademicYearViewSet, GradeViewSet, TermViewSet # FacultyViewset, DepartmentViewset
#from .views_elasticsearch import UserDocumentViewSet 

app_name = "users"

router = routers.DefaultRouter()
router.register('users', UserViewSet)
router.register('schools', SchoolViewSet)
router.register('colleges', CollegeViewSet)
router.register('faculties', FacultyViewSet)
router.register('programmes', ProgrammeViewSet)
router.register('courses', CourseViewSet)
router.register('academicyears', AcademicYearViewSet)
router.register('grades', GradeViewSet)
router.register('terms', TermViewSet)
#router.register('users-search', UserDocumentViewSet, basename='userdocument')


