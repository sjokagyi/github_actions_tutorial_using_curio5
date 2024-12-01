"""
URL configuration for curio4 project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf import settings
from django.urls import path, include
from django.conf.urls.static import static
from django.contrib.auth.decorators import user_passes_test
from django.http import HttpResponseRedirect
from django.urls import reverse
from frontend.views import home
from users import router as users_api_router
from users.viewsets import CustomTokenObtainPairView
from questions import router as questions_api_router
from resources import router as resources_api_router
from analytics import router as analytics_api_router
from questions.router import test_history_urlpattern, test_answers_urlpattern, test_results_urlpattern, test_result_urlpattern
from questions.viewsets import SubmittedTestsViewSet
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)

def is_curio_admin(user):
    return user.is_authenticated and user.is_curio_admin

@user_passes_test(is_curio_admin, login_url='/admin/login/')
def custom_admin_view(request):
    return HttpResponseRedirect(reverse('admin:index'))

auth_api_urls = [
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
] 

api_url_patterns = [
    path(r'auth/', include(auth_api_urls)),
    path(r'accounts/', include(users_api_router.router.urls)),
    path(r'questions/', include(questions_api_router.router.urls)),
    path(r'resources/', include(resources_api_router.router.urls)),
    path(r'analytics/', include(analytics_api_router.router.urls)),
    path(r'questions/', include(test_history_urlpattern)),
    path(r'questions/', include(test_results_urlpattern)),
    path(r'questions/', include(test_answers_urlpattern)),
    path(r'questions/', include(test_result_urlpattern)),
    path('questions/submitted-tests/eligible/', SubmittedTestsViewSet.as_view({'get': 'list_eligible'}), name='eligible-submitted-tests'),
    path('questions/submitted-tests/<str:test_id>/', SubmittedTestsViewSet.as_view({'get': 'list'}), name='submitted-tests'),
] 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(api_url_patterns)),
#    path('users/', include('users.urls')),
    path('', home, name='home'),

]

if settings.DEBUG:
    # Include authentication URLs for development
    auth_api_urls.append(path(r'verify/', include('rest_framework.urls')))
    
    # Serve media files through Django in development
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 