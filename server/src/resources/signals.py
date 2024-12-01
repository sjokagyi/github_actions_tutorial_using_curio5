from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Resource
from .documents import ResourceDocument

@receiver(post_save, sender=Resource)
def update_resource_document(sender, instance, **kwargs):
    ResourceDocument().update(instance)

@receiver(post_delete, sender=Resource)
def delete_resource_document(sender, instance, **kwargs):
    ResourceDocument().delete(instance)