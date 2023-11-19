from django.db.models.signals import post_save
from django.dispatch import receiver

from boards.models import Board, ListBoard
from users.models import CustomUser

@receiver(post_save, sender=CustomUser)
def create_default_board(sender, instance, created, **kwargs):
    if created:
        board = Board.objects.create(user=instance, name="My Default Board")

        ListBoard.objects.create(board=board, name="Todo", position=1)
        ListBoard.objects.create(board=board, name="In Progress", position=2)
        ListBoard.objects.create(board=board, name="Done", position=3)