from __future__ import absolute_import, unicode_literals
from django.apps import AppConfig

class QuestionsConfig(AppConfig):
    name = 'questions'

    def ready(self):
        from .tasks import auto_submit_test_sessions
