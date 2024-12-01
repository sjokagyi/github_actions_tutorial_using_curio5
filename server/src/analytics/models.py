from django.db import models

class AnalyticsReport(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    report_data = models.JSONField()
    report_type = models.CharField(max_length=255)
    # Add more fields as necessary
