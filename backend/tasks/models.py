from django.db import models
from django.conf import settings

class Tag(models.Model):
    """
    Represents a tag that can be associated with tasks.

    :param name: The unique name of the tag.
    """
    name = models.CharField(max_length=255)


class Task(models.Model):
    """
    Represents a Abstract of task, such as Habit, Daily, Todo, or Reward.
    
    :param user: The user who owns the task.
    :param title: Title of the task.
    :param notes: Optional additional notes for the task.
    :param tags: Associated tags for the task.
    :param importance: The importance of the task (range: 1 to 5)
    :param difficulty: The difficulty of the task (range: 1 to 5).
    :param challenge: Associated challenge (optional).
    :param fromSystem: A boolean field indicating if the task is from System.
    :param creation_date: Creation date of the task.
    :param last_update: Last updated date of the task.
    :param: google_calendar_id: Google Calendar Event ID of the task.
    :param start_event: Start event of the task.
    :param end_event: End event(Due Date) of the task.
    """
    class Difficulty(models.IntegerChoices):
        EASY = 1, 'Easy'
        NORMAL = 2, 'Normal'
        HARD = 3, 'Hard'
        VERY_HARD = 4, 'Very Hard'
        DEVIL = 5, 'Devil'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.TextField()
    notes = models.TextField(default='')
    tags = models.ManyToManyField(Tag, blank=True)
    importance = models.PositiveSmallIntegerField(choices=[(i, str(i)) for i in range(1, 6)], default=1)
    difficulty = models.PositiveSmallIntegerField(choices=Difficulty.choices, default=Difficulty.EASY)
    challenge = models.BooleanField(default=False)
    fromSystem = models.BooleanField(default=False)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_update = models.DateTimeField(auto_now=True)
    google_calendar_id = models.CharField(max_length=255, null=True, blank=True)
    start_event = models.DateTimeField(null=True)
    end_event = models.DateTimeField(null=True)

    class Meta:
        abstract = True


class Todo(Task):
    
    class EisenhowerMatrix(models.IntegerChoices):
        IMPORTANT_URGENT = 1, 'Important & Urgent'
        IMPORTANT_NOT_URGENT = 2, 'Important & Not Urgent'
        NOT_IMPORTANT_URGENT = 3, 'Not Important & Urgent'
        NOT_IMPORTANT_NOT_URGENT = 4, 'Not Important & Not Urgent'

    completed = models.BooleanField(default=False)
    priority = models.PositiveSmallIntegerField(choices=EisenhowerMatrix.choices, default=EisenhowerMatrix.NOT_IMPORTANT_NOT_URGENT)

    def __str__(self):
        return self.title

class RecurrenceTask(Task):
    completed = models.BooleanField(default=False)
    recurrence_rule = models.CharField()

    def __str__(self) -> str:
        return f"{self.title} ({self.recurrence_rule})"


class Habit(Task):
    streak = models.IntegerField(default=0)

    def __str__(self) -> str:
        return f"{self.title} ({self.streak})"


class Subtask(models.Model):
    """
    Represents a subtask associated with a task.
    :param description: Description of the subtask.
    :param completed: A boolean field indicating whether the subtask is completed.
    :param parent_task: The parent task of the subtask.
    """
    parent_task = models.ForeignKey(Todo, on_delete=models.CASCADE)
    description = models.TextField()
    completed = models.BooleanField(default=False)


class UserNotification(models.Model):
    """
    Represents a user notification.

    :param type: The type of the notification (e.g., 'NEW_CHAT_MESSAGE').
    :param data: JSON data associated with the notification.
    :param seen: A boolean field indicating whether the notification has been seen.
    """
    NOTIFICATION_TYPES = (
        ('LEVEL_UP', 'Level Up'),
        ('DEATH', 'Death'),
    )

    type = models.CharField(max_length=255, choices=[type for type in NOTIFICATION_TYPES])
    data = models.JSONField(default=dict)
    seen = models.BooleanField(default=False)

    @staticmethod
    def clean_notification(notifications):
        """
        Cleanup function for removing corrupt notification data:
        - Removes notifications with null or missing id or type.
        """
        if not notifications:
            return notifications

        filtered_notifications = []

        for notification in notifications:
            if notification.id is None or notification.type is None:
                continue

        return filtered_notifications


class Transaction(models.Model):
    """
    Represents a transaction involving currencies in the system.

    :param currency: The type of currency used in the transaction
    :param transactionType: The type of the transaction
    :param description: Additional text.
    :param amount: The transaction amount.
    :param user: The user involved in the transaction.
    """
    CURRENCIES = (('gold', 'Gold'),)
    TRANSACTION_TYPES = (
    ('buy_gold', 'Buy Gold'),
    ('spend', 'Spend'),
    ('debug', 'Debug'),
    ('force_update_gold', 'Force Update Gold'),
    )

    currency = models.CharField(max_length=12, choices=CURRENCIES)
    transaction_type = models.CharField(max_length=24, choices=TRANSACTION_TYPES)
    description = models.TextField(blank=True)
    amount = models.FloatField(default=0)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return f"Transaction ({self.id})"