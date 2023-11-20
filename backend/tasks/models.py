from django.db import models
from django.conf import settings

from boards.models import ListBoard, Board

class Tag(models.Model):
    """
    Represents a tag that can be associated with tasks.

    :param name: The unique name of the tag.
    """
    name = models.CharField(max_length=255)


class Task(models.Model):
    """
    Represents a Abstract of task, such as Habit, Recurrence, Todo.
    
    :param user: The user who owns the task.
    :param title: Title of the task.
    :param notes: Optional additional notes for the task.
    :param tags: Associated tags for the task.
    :param importance: The importance of the task (range: 1 to 5)
    :param difficulty: The difficulty of the task (range: 1 to 5).
    :param challenge: Associated challenge (optional).
    :param fromSystem: A boolean field indicating if the task is from System.
    :param creation_date: Creation date of the task.
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

    class Meta:
        abstract = True


class Todo(Task):
    """
    Represent a Todo task.

    :param list_board: The list board that the task belongs to.
    :param is_active: A boolean field indicating whether the task is active. (Archive or not)
    :param is_full_day_event: A boolean field indicating whether the task is a full day event.
    :param start_event: Start date and time of the task.
    :param end_event: End date and time of the task.
    :param google_calendar_id: The Google Calendar ID of the task.
    :param completed: A boolean field indicating whether the task is completed.
    :param priority: The priority of the task (range: 1 to 4).
    """
    class EisenhowerMatrix(models.IntegerChoices):
        IMPORTANT_URGENT = 1, 'Important & Urgent'
        IMPORTANT_NOT_URGENT = 2, 'Important & Not Urgent'
        NOT_IMPORTANT_URGENT = 3, 'Not Important & Urgent'
        NOT_IMPORTANT_NOT_URGENT = 4, 'Not Important & Not Urgent'

    list_board = models.ForeignKey(ListBoard, on_delete=models.CASCADE, null=True, default=1)
    is_active = models.BooleanField(default=True)
    is_full_day_event = models.BooleanField(default=False)
    start_event = models.DateTimeField(null=True)
    end_event = models.DateTimeField(null=True)
    google_calendar_id = models.CharField(max_length=255, null=True, blank=True)
    completed = models.BooleanField(default=False)
    priority = models.PositiveSmallIntegerField(choices=EisenhowerMatrix.choices, default=EisenhowerMatrix.NOT_IMPORTANT_NOT_URGENT)

    def __str__(self):
        return self.title

class RecurrenceTask(Task):
    """
    Represent a Recurrence task. (Occure every day, week, month, year)

    :param list_board: The list board that the task belongs to.
    :param rrule: The recurrence rule of the task.
    :param is_active: A boolean field indicating whether the task is active. (Archive or not)
    :param is_full_day_event: A boolean field indicating whether the task is a full day event.
    :param start_event: Start date and time of the task.
    :param end_event: End date and time of the task.
    :param completed: A boolean field indicating whether the task is completed.
    :param parent_task: The parent task of the subtask.
    """
    list_board = models.ForeignKey(ListBoard, on_delete=models.CASCADE, null=True, default=1)
    rrule = models.CharField(max_length=255, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_full_day_event = models.BooleanField(default=False)
    start_event = models.DateTimeField(null=True)
    end_event = models.DateTimeField(null=True)
    completed = models.BooleanField(default=False)
    parent_task = models.ForeignKey("self", on_delete=models.CASCADE, null=True)

    def __str__(self) -> str:
        return f"{self.title} ({self.recurrence_rule})"


class RecurrencePattern(models.Model):
    """
    :param recurrence_task: The recurrence task that the pattern belongs to.
    :param recurring_type: The type of recurrence.
    :param max_occurrences: The maximum number of occurrences.
    :param day_of_week: The day of the week that event will occure.
    :param week_of_month: The week of the month that event will occure.
    :param day_of_month: The day of the month that event will occure.
    :param month_of_year: The month of the year that event will occure.
    """
    class RecurringType(models.IntegerChoices):
        DAILY = 0, 'Daily'
        WEEKLY = 1, 'Weekly'
        MONTHLY = 2, 'Monthly'
        YEARLY = 3, 'Yearly'

    class DayOfWeek(models.IntegerChoices):
        MONDAY = 0, 'Monday'
        TUESDAY = 1, 'Tuesday'
        WEDNESDAY = 2, 'Wednesday'
        THURSDAY = 3, 'Thursday'
        FRIDAY = 4, 'Friday'
        SATURDAY = 5, 'Saturday'
        SUNDAY = 6, 'Sunday'

    class WeekOfMonth(models.IntegerChoices):
        FIRST = 1, 'First'
        SECOND = 2, 'Second'
        THIRD = 3, 'Third'
        FOURTH = 4, 'Fourth'
        LAST = 5, 'Last'

    class MonthOfYear(models.IntegerChoices):
        JANUARY = 1, 'January'
        FEBRUARY = 2, 'February'
        MARCH = 3, 'March'
        APRIL = 4, 'April'
        MAY = 5, 'May'
        JUNE = 6, 'June'
        JULY = 7, 'July'
        AUGUST = 8, 'August'
        SEPTEMBER = 9, 'September'
        OCTOBER = 10, 'October'
        NOVEMBER = 11, 'November'
        DECEMBER = 12, 'December'

    recurrence_task = models.ForeignKey(RecurrenceTask, on_delete=models.CASCADE)
    recurring_type = models.IntegerField(choices=RecurringType.choices)
    max_occurrences = models.IntegerField(default=0)
    day_of_week = models.IntegerField(choices=DayOfWeek.choices)
    week_of_month = models.IntegerField(choices=WeekOfMonth.choices)
    day_of_month = models.IntegerField(default=0)
    month_of_year = models.IntegerField(choices=MonthOfYear.choices)


class Habit(Task):
    """
    Represent a Habit task with streaks.

    :param streak: The streak of the habit.
    :param current_count: The current count of the habit.
    """
    streak = models.IntegerField(default=0)
    current_count = models.IntegerField(default=0)

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