from __future__ import absolute_import, unicode_literals
from django.apps import AppConfig

class AnalyticsConfig(AppConfig):
    name = 'analytics'

    def ready(self):
        from .tasks import extract_data, upload_data_to_s3