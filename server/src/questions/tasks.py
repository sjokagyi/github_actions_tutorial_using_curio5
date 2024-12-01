import os
from celery import shared_task
from .models import StudentTestSession

@shared_task
def auto_submit_test_sessions():
     #Get the current time
    current_time = timezone.now()
    # Loop over all test sessions that are still active
    for test_session in StudentTestSession.objects.filter(end_time__isnull=True):
        # If the current time exceeds the end time based on the session's start time and test's max time
        if current_time >= (test_session.start_time + timedelta(minutes=test_session.test.max_time)):
            # Call the auto_submit method to handle the submission
            test_session.auto_submit()