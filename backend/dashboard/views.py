from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from django.utils import timezone

from tasks.models import Todo, RecurrenceTask

class DashboardStatsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Calculate task usage statistics
        todo_count = Todo.objects.filter(user=user).count()
        recurrence_task_count = RecurrenceTask.objects.filter(user=user).count()

        # Calculate how many tasks were completed in the last 7 days
        completed_todo_count_last_week = Todo.objects.filter(user=user, completed=True, last_update__gte=timezone.now() - timezone.timedelta(days=7)).count()
        completed_recurrence_task_count_last_week = RecurrenceTask.objects.filter(user=user, completed=True, last_update__gte=timezone.now() - timezone.timedelta(days=7)).count()

        # Calculate subtask completion rate
        total_subtasks = Todo.objects.filter(user=user).aggregate(total=Count('subtask__id'))['total']
        completed_subtasks = Todo.objects.filter(user=user, subtask__completed=True).aggregate(total=Count('subtask__id'))['total']

        # Calculate overall completion rate
        total_tasks = todo_count + recurrence_task_count
        completed_tasks = completed_todo_count_last_week + completed_recurrence_task_count_last_week
        overall_completion_rate = (completed_tasks / total_tasks) * 100 if total_tasks > 0 else 0

        # pie chart show
        complete_todo_percent_last_week =  (completed_todo_count_last_week / todo_count) * 100 if todo_count > 0 else 0

        complete_recurrence_percent_last_week = (completed_recurrence_task_count_last_week / recurrence_task_count) * 100 if recurrence_task_count > 0 else 0

        incomplete_task_percent_last_week = 100 -  complete_recurrence_percent_last_week - complete_todo_percent_last_week

        data = {
            'todo_count': todo_count,
            'recurrence_task_count': recurrence_task_count,
            'completed_todo_count_last_week': completed_todo_count_last_week,
            'completed_recurrence_task_count_last_week': completed_recurrence_task_count_last_week,
            'total_subtasks': total_subtasks,
            'completed_subtasks': completed_subtasks,
            'overall_completion_rate': overall_completion_rate,
            'complete_todo_percent_last_week': complete_todo_percent_last_week,
            'complete_recurrence_percent_last_week' : complete_recurrence_percent_last_week,
            'incomplete_task_percent_last_week': incomplete_task_percent_last_week,

        }

        return Response(data, status=status.HTTP_200_OK)
    
    def post(self, request):
        # Handle incoming data from the POST request
        # Update the necessary information based on the data

        task_id = request.data.get('task_id')
        is_completed = request.data.get('is_completed')

        try:
            task = Todo.objects.get(id=task_id, user=request.user)
            task.completed = is_completed
            task.save()
            return Response({'message': 'Task completion status updated successfully'}, status=status.HTTP_200_OK)
        except Todo.DoesNotExist:
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)
    
class WeeklyStatsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today = timezone.now()

        # Calculate the start and end dates for the current week
        current_week_start = today - timezone.timedelta(days=today.weekday())
        current_week_end = current_week_start + timezone.timedelta(days=6)

        # Initialize a list to store daily statistics
        weekly_stats = []

        # Loop through each day of the week
        for i in range(7):
            # Calculate the start and end dates for the current day
            current_day_start = current_week_start + timezone.timedelta(days=i)
            current_day_end = current_day_start + timezone.timedelta(days=1)

            # Calculate the start and end dates for the same day over the last 7 days
            last_7_days_start = current_day_start - timezone.timedelta(days=7)
            last_7_days_end = current_day_end - timezone.timedelta(days=7)

            # Calculate statistics for the current day
            current_day_stats = self.calculate_stats(user, current_day_start, current_day_end)

            # Calculate statistics for the same day over the last 7 days
            last_7_days_stats = self.calculate_stats(user, last_7_days_start, last_7_days_end)

            # Calculate the percentage change
            percent_change = self.calculate_percent_change(
                current_day_stats['overall_completion_rate'],
                last_7_days_stats['overall_completion_rate']
            )

            # Append the daily statistics to the list
            weekly_stats.append({
                'day_of_week': current_day_start.strftime('%A'),
                'current_day_stats': current_day_stats,
                'last_7_days_stats': last_7_days_stats,
                'percent_change': percent_change,
            })

        response_data = {
            'weekly_stats': weekly_stats,
        }

        return Response(response_data, status=status.HTTP_200_OK)

    def calculate_stats(self, user, start_date, end_date):
        # Calculate task usage statistics for the specified day
        todo_count = Todo.objects.filter(user=user, created_at__gte=start_date, created_at__lte=end_date).count()
        recurrence_task_count = RecurrenceTask.objects.filter(user=user, created_at__gte=start_date, created_at__lte=end_date).count()

        # Calculate how many tasks were completed on the specified day
        completed_todo_count = Todo.objects.filter(user=user, completed=True, last_update__gte=start_date, last_update__lte=end_date).count()
        completed_recurrence_task_count = RecurrenceTask.objects.filter(user=user, completed=True, last_update__gte=start_date, last_update__lte=end_date).count()

        # Calculate subtask completion rate for the specified day
        total_subtasks = Todo.objects.filter(user=user, created_at__gte=start_date, created_at__lte=end_date).aggregate(total=Count('subtask__id'))['total']
        completed_subtasks = Todo.objects.filter(user=user, subtask__completed=True, created_at__gte=start_date, created_at__lte=end_date).aggregate(total=Count('subtask__id'))['total']

        # Calculate overall completion rate for the specified day
        total_tasks = todo_count + recurrence_task_count
        completed_tasks = completed_todo_count + completed_recurrence_task_count
        overall_completion_rate = (completed_tasks / total_tasks) * 100 if total_tasks > 0 else 0

        return {
            'start_date': start_date.strftime('%Y-%m-%d'),
            'end_date': end_date.strftime('%Y-%m-%d'),
            'todo_count': todo_count,
            'recurrence_task_count': recurrence_task_count,
            'completed_todo_count': completed_todo_count,
            'completed_recurrence_task_count': completed_recurrence_task_count,
            'total_subtasks': total_subtasks,
            'completed_subtasks': completed_subtasks,
            'overall_completion_rate': overall_completion_rate,
        }

    def calculate_percent_change(self, current_value, last_value):
        # Calculate the percentage change between current and last values
        if last_value != 0:
            percent_change = ((current_value - last_value) / last_value) * 100
        else:
            percent_change = current_value * 100  # Consider infinite change when the last value is zero

        return round(percent_change, 2)