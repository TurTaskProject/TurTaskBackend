from django.db import models

from users.models import CustomUser

class Board(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.name}"


class ListBoard(models.Model):
    board = models.ForeignKey(Board, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    position = models.IntegerField()

    def __str__(self) -> str:
        return f"{self.name}"
