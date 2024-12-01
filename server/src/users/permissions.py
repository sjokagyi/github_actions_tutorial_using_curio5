from rest_framework import permissions
from rest_framework.permissions import BasePermission

class IsCurioAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.is_curio_admin or request.user.is_superuser))

class IsSchoolAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.is_admin))

class IsTeacher(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.is_staff))

class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.user_type == 'student')

class IsUserOwnerOrGetAndPostOnly(permissions.BasePermission):
    """
    Custom permissions for UserViewSet to only allow user to update their own user otherwise, Get and Post Only.
    """

    def has_permission(self, request, view):
        return True

    def has_object_permission(self, request, view, obj):

        if request.method in permissions.SAFE_METHODS:
            return True

        if not request.user.is_anonymous:
            return request.user == obj

        return False
