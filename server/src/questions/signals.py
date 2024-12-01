from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Question, Choice

@receiver(post_save, sender=Question)
def create_tf_choices(sender, instance, created, **kwargs):
    print("Signal triggered for Question:", instance)
    if instance.question_type == 'TF' and created:
        Choice.objects.create(question=instance, content='True', is_correct=instance.correct_answer)
        Choice.objects.create(question=instance, content='False', is_correct=not instance.correct_answer)
        print("Choices created for Question ID:", instance.id, "Question:", instance)