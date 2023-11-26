from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils import timezone

from tasks.models import Todo


@receiver(pre_save, sender=Todo)
def update_priority(sender, instance, **kwargs):
    """Update the priority of a Todo based on the Eisenhower Matrix"""
    if instance.end_event:
        time_until_due = (instance.end_event - timezone.now()).days
    else:
        time_until_due = float('inf')

    urgency_threshold = 3
    importance_threshold = 3

    if time_until_due <= urgency_threshold and instance.importance >= importance_threshold:
        instance.priority = Todo.EisenhowerMatrix.IMPORTANT_URGENT
    elif time_until_due > urgency_threshold and instance.importance >= importance_threshold:
        instance.priority = Todo.EisenhowerMatrix.IMPORTANT_NOT_URGENT
    elif time_until_due <= urgency_threshold and instance.importance < importance_threshold:
        instance.priority = Todo.EisenhowerMatrix.NOT_IMPORTANT_URGENT
    else:
        instance.priority = Todo.EisenhowerMatrix.NOT_IMPORTANT_NOT_URGENT