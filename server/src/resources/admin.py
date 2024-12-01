from django.contrib import admin
from .models import Resource, Comment, Tag, TestUpload

class ResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'resource_type', 'uploaded_by', 'school', 'course', 'upload_date')
    search_fields = ('title', 'description')
    list_filter = ('resource_type', 'school', 'course', 'upload_date')
    ordering = ('-upload_date',)

class CommentAdmin(admin.ModelAdmin):
    list_display = ('resource', 'user', 'text', 'created_at')
    search_fields = ('text',)
    list_filter = ('created_at', 'user')
    ordering = ('-created_at',)

class TagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

class TestUploadAdmin(admin.ModelAdmin):
    list_display = ('title', 'file')
    search_fields = ('title',)

admin.site.register(Resource, ResourceAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Tag, TagAdmin)
admin.site.register(TestUpload, TestUploadAdmin)