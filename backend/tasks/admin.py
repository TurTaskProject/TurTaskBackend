from django.contrib import admin
from .models import Tag, Todo, RecurrenceTask, RecurrencePattern, Habit, Subtask

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name']

@admin.register(Todo)
class TodoAdmin(admin.ModelAdmin):
    list_display = ['title', 'list_board', 'is_active', 'priority', 'completed', 'completion_date']
    list_filter = ['list_board', 'is_active', 'priority', 'completed']
    exclude = ['completion_date']

@admin.register(RecurrenceTask)
class RecurrenceTaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'list_board', 'rrule', 'is_active']
    list_filter = ['list_board', 'rrule', 'is_active']

@admin.register(RecurrencePattern)
class RecurrencePatternAdmin(admin.ModelAdmin):
    list_display = ['recurrence_task', 'recurring_type', 'day_of_week', 'week_of_month', 'day_of_month', 'month_of_year']

@admin.register(Habit)
class HabitAdmin(admin.ModelAdmin):
    list_display = ['title', 'streak', 'current_count']

@admin.register(Subtask)
class SubtaskAdmin(admin.ModelAdmin):
    list_display = ['parent_task', 'description', 'completed']
    list_filter = ['parent_task', 'completed']
