from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.utils import timezone

from boards.models import ListBoard
from tasks.models import Todo


@receiver(pre_save, sender=Todo)
def update_priority(sender, instance, **kwargs):
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


@receiver(post_save, sender=Todo)
def assign_todo_to_listboard(sender, instance, created, **kwargs):
    if created:
        user_board = instance.user.board_set.first()

        if user_board:
            first_list_board = user_board.listboard_set.order_by('position').first()

            if first_list_board:
                instance.list_board = first_list_board
                instance.save()