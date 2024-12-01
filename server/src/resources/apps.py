from django.apps import AppConfig

class ResourcesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'resources'

    def ready(self):
        import resources.signals  # Import the signals module