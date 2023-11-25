from django.db.models.signals import post_save
from django.dispatch import receiver

from boards.models import Board, ListBoard
from users.models import CustomUser

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