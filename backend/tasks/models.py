from django.db import models
from django.conf import settings
from django.core import validators
from django.utils import timezone

class Tag(models.Model):
    """
    Represents a tag that can be associated with tasks.
    Fields:
    - name: The unique name of the tag.
    """
    name = models.CharField(max_length=255)

class Task(models.Model):
    """
    Represents a task, such as Habit, Daily, Todo, or Reward.
    Fields:
    - type: The type of the tasks
    - title: Title of the task.
    - notes: Optional additional notes for the task.
    - tags: Associated tags for the task.
    - completed: A boolean field indicating whether the task is completed.
    - exp: The experience values user will get from the task.
    - priority: The priority of the task (range: 0.1 to 2).
    - difficulty: The difficulty of the task (range: 1 to 5).
    - attribute: The attribute linked to the task
    - user: The user who owns the task.
    - challenge: Associated challenge (optional).
    - reminders: A Many-to-Many relationship with Reminder.
    - fromSystem: A boolean field indicating if the task is from System.
    - creation_date: Creation date of the task.
    - last_update: Last updated date of the task.
    """
    TASK_TYPES = [
        ('daily', 'Daily'),
        ('habit', 'Habit'),
        ('todo', 'Todo'),
        ('Long Term Goal', 'Long Term Goal'),
    ]

    DIFFICULTY_CHOICES = [
        (1, 'Easy'),
        (2, 'Normal'),
        (3, 'Hard'),
        (4, 'Very Hard'),
        (5, 'Devil'),
    ]

    type = models.CharField(max_length=15, choices=TASK_TYPES, default='habit')
    title = models.TextField()
    notes = models.TextField(default='')
    tags = models.ManyToManyField(Tag, blank=True)
    completed = models.BooleanField(default=False)
    exp = models.FloatField(default=0)
    priority = models.FloatField(default=1, validators=[
        validators.MinValueValidator(0.1),
        validators.MaxValueValidator(2),
    ])
    difficulty = models.PositiveSmallIntegerField(choices=DIFFICULTY_CHOICES, default=1)
    attribute = models.CharField(max_length=15, choices=[
        ('str', 'Strength'),
        ('int', 'Intelligence'),
        ('end', 'Endurance'),
        ('per', 'Perception'),
        ('luck', 'Luck'),
    ], default='str')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    challenge = models.BooleanField(default=False)
    fromSystem = models.BooleanField(default=False)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_update = models.DateTimeField(auto_now=True)
    google_calendar_id = models.CharField(blank=True, null=True, max_length=255)
    start_event = models.DateTimeField(null=True)
    end_event = models.DateTimeField(null=True)


class Subtask(models.Model):
    """
    Represents a subtask associated with a task.
    - description: Description of the subtask.
    - completed: A boolean field indicating whether the subtask is completed.
    - parent_task: The parent task of the subtask.
    """
    description = models.TextField()
    completed = models.BooleanField(default=False)
    parent_task = models.ForeignKey(Task, on_delete=models.CASCADE)


class UserNotification(models.Model):
    """
    Represents a user notification.
    Fields:
    - type: The type of the notification (e.g., 'NEW_CHAT_MESSAGE').
    - data: JSON data associated with the notification.
    - seen: A boolean field indicating whether the notification has been seen.
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
    Fields:
    - currency: The type of currency used in the transaction
    - transactionType: The type of the transaction
    - description: Additional text.
    - amount: The transaction amount.
    - user: The user involved in the transaction.
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