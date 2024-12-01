from celery import shared_task
from .models import Resource

import logging

logger = logging.getLogger(__name__)

@shared_task
def process_upload(resource_id):
    try:
        resource = Resource.objects.get(id=resource_id)
        logger.info(f'Processing resource: {resource.title}')
        # Example processing logic
        print(f'Processing resource: {resource.title}')
        # Additional processing like resizing images, etc.
        # resource.processed = True
        # resource.save()
    except Resource.DoesNotExist:
        logger.error(f'Resource with id {resource_id} does not exist')
        print(f'Resource with id {resource_id} does not exist')


@shared_task
def add(x, y):
    return x + y