from django.utils import timezone
from django.db.models.signals import post_save
from django.dispatch import receiver

from tasks.models import Todo
from users.models import CustomUser, UserStats
from boards.models import ListBoard, Board


@receiver(post_save, sender=CustomUser)
def create_user_stats(sender, instance, created, **kwargs):
    if created:
        UserStats.objects.create(user=instance)


@receiver(post_save, sender=CustomUser)
def create_default_board(sender, instance, created, **kwargs):
    """Signal handler to automatically create a default Board for a user upon creation."""
    if created:
        # Create unique board by user id
        user_id = instance.id
        board = Board.objects.create(user=instance, name=f"Board of #{user_id}")
        ListBoard.objects.create(board=board, name="Backlog", position=1)
        ListBoard.objects.create(board=board, name="Doing", position=2)
        ListBoard.objects.create(board=board, name="Review", position=3)
        ListBoard.objects.create(board=board, name="Done", position=4)


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