from django.db import models

from users.models import CustomUser

class Board(models.Model):
    """
    Kanban board model.

    :param user: The user who owns the board.
    :param name: The name of the board.
    :param created_at: The date and time when the board was created.
    """
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.name}"


class ListBoard(models.Model):
    """
    List inside a Kanban board.

    :param board: The board that the list belongs to.
    :param name: The name of the list.
    :param position: The position of the list in Kanban.
    """
    board = models.ForeignKey(Board, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    position = models.IntegerField()

    def __str__(self) -> str:
        return f"{self.name}"
