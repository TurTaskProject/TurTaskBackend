from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.utils import timezone

from boards.models import ListBoard, Board
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


# @receiver(post_save, sender=Todo)
# def assign_todo_to_listboard(sender, instance, created, **kwargs):
#     """Signal handler to automatically assign a Todo to the first ListBoard in the user's Board upon creation."""
#     if created:
#         user_board = instance.user.board_set.first()

#         if user_board:
#             first_list_board = user_board.listboard_set.order_by('position').first()

#             if first_list_board:
#                 instance.list_board = first_list_board
#                 instance.save()


@receiver(post_save, sender=ListBoard)
def create_placeholder_tasks(sender, instance, created, **kwargs):
    """
    Signal handler to create placeholder tasks for each ListBoard.
    """
    if created:
        list_board_position = instance.position

        if list_board_position == 1:
            placeholder_tasks = [
                {"title": "Normal Task Example"},
                {"title": "Task with Extra Information Example", "description": "Description for Task 2"},
            ]
        elif list_board_position == 2:
            placeholder_tasks = [
                {"title": "Time Task Example #1", "description": "Description for Task 2",
                 "start_event": timezone.now(), "end_event": timezone.now() + timezone.timedelta(days=5)},
            ]
        elif list_board_position == 3:
            placeholder_tasks = [
                {"title": "Time Task Example #2", "description": "Description for Task 2",
                 "start_event": timezone.now(), "end_event": timezone.now() + timezone.timedelta(days=30)},
            ]
        elif list_board_position == 4:
            placeholder_tasks = [
                {"title": "Completed Task Example", "description": "Description for Task 2",
                 "start_event": timezone.now(), "completed": True},
            ]
        else:
            placeholder_tasks = [
                {"title": "Default Task Example"},
            ]

        for task_data in placeholder_tasks:
            Todo.objects.create(
                list_board=instance,
                user=instance.board.user,
                title=task_data["title"],
                notes=task_data.get("description", ""),
                is_active=True,
                start_event=task_data.get("start_event"),
                end_event=task_data.get("end_event"),
                completed=task_data.get("completed", False),
                creation_date=timezone.now(),
                last_update=timezone.now(),
            )