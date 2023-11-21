from django.contrib.postgres.fields import ArrayField
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


class KanbanTaskOrder(models.Model):
    """
    Model to store the order of Todo tasks in a Kanban board.

    :param list_board: The list board that the order belongs to.
    :param todo_order: ArrayField to store the order of Todo IDs.
    """
    list_board = models.OneToOneField('ListBoard', on_delete=models.CASCADE)
    todo_order = ArrayField(models.PositiveIntegerField(), blank=True, default=list)

    def __str__(self):
        return f"Order for {self.list_board}"


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

    def save(self, *args, **kwargs):
        super(ListBoard, self).save(*args, **kwargs)
        kanban_order, created = KanbanTaskOrder.objects.get_or_create(list_board=self)
        if not created:
            return
    
    def __str__(self) -> str:
        return f"{self.name}"

