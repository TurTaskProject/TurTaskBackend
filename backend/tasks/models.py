from datetime import datetime

from django.db import models
from django.conf import settings
from django.core import validators
from django.utils import timezone

class Tag(models.Model):
    """
    Represents a tag that can be associated with tasks.

    :param name: The unique name of the tag.
    """
    name = models.CharField(max_length=255)


class Task(models.Model):
    """
    Represents a task, such as Habit, Daily, Todo, or Reward.

    :param type: The type of the tasks
    :param title: Title of the task.
    :param notes: Optional additional notes for the task.
    :param tags: Associated tags for the task.
    :param completed: A boolean field indicating whether the task is completed.
    :param exp: The experience values user will get from the task.
    :param priority: The priority of the task (1, 2, .., 4), using Eisenhower Matrix Idea.
    :param importance: The importance of the task (range: 1 to 5)
    :param difficulty: The difficulty of the task (range: 1 to 5).
    :param attribute: The attribute linked to the task
    :param user: The user who owns the task.
    :param challenge: Associated challenge (optional).
    :param reminders: A Many-to-Many relationship with Reminder.
    :param fromSystem: A boolean field indicating if the task is from System.
    :param creation_date: Creation date of the task.
    :param last_update: Last updated date of the task.
    :param: google_calendar_id: Google Calendar Event ID of the task.
    :param start_event: Start event of the task.
    :param end_event: End event(Due Date) of the task.
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

    ATTRIBUTE = [
        ('str', 'Strength'),
        ('int', 'Intelligence'),
        ('end', 'Endurance'),
        ('per', 'Perception'),
        ('luck', 'Luck'),
    ]

    EISENHOWER_MATRIX = [
        (1, 'Important & Urgent'),
        (2, 'Important & Not Urgent'),
        (3, 'Not Important & Urgent'),
        (4, 'Not Important & Not Urgent'),
    ]

    type = models.CharField(max_length=15, choices=TASK_TYPES, default='habit')
    title = models.TextField()
    notes = models.TextField(default='')
    tags = models.ManyToManyField(Tag, blank=True)
    completed = models.BooleanField(default=False)
    exp = models.FloatField(default=0)
    priority = models.PositiveSmallIntegerField(choices=EISENHOWER_MATRIX, default=4)
    importance = models.PositiveSmallIntegerField(choices=[(i, str(i)) for i in range(1, 6)], default=1)
    difficulty = models.PositiveSmallIntegerField(choices=DIFFICULTY_CHOICES, default=1)
    attribute = models.CharField(max_length=15, choices=ATTRIBUTE, default='str')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    challenge = models.BooleanField(default=False)
    fromSystem = models.BooleanField(default=False)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_update = models.DateTimeField(auto_now=True)
    google_calendar_id = models.CharField(blank=True, null=True, max_length=255)
    start_event = models.DateTimeField(null=True)
    end_event = models.DateTimeField(null=True)

    def calculate_eisenhower_matrix_category(self):
        """
        Classify the task into one of the four categories in the Eisenhower Matrix.

        :return: The category of the task (1, 2, 3, or 4).
        """
        if self.end_event:
            time_until_due = (self.end_event - datetime.now(timezone.utc)).days
        else:
            time_until_due = float('inf')

        urgency_threshold = 3
        importance_threshold = 3

        if time_until_due <= urgency_threshold and self.importance >= importance_threshold:
            return 1
        elif time_until_due > urgency_threshold and self.importance >= importance_threshold:
            return 2
        elif time_until_due <= urgency_threshold and self.importance < importance_threshold:
            return 3
        else:
            return 4

    def get_exp(self):
        return self.user.level * (0.2*self.difficulty) * (0.3*self.user.userstats.luck)

    def get_reward(self):
        pass

    def get_penalty(self):
        pass



    def save(self, *args, **kwargs):
        self.priority = self.calculate_eisenhower_matrix_category()
        super(Task, self).save(*args, **kwargs)

    class Meta:
        verbose_name = 'Task'
        verbose_name_plural = 'Tasks'



class Subtask(models.Model):
    """
    Represents a subtask associated with a task.
    :param description: Description of the subtask.
    :param completed: A boolean field indicating whether the subtask is completed.
    :param parent_task: The parent task of the subtask.
    """
    description = models.TextField()
    completed = models.BooleanField(default=False)
    parent_task = models.ForeignKey(Task, on_delete=models.CASCADE)


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