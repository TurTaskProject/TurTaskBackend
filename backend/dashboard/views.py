from datetime import timedelta
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, mixins

from tasks.models import Todo, RecurrenceTask


class DashboardStatsTodoViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    """
    A viewset for retrieving statistics related to user tasks for the last 7 days.
    """
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Todo.objects.all()

    def list(self, request, *args, **kwargs):
        user = self.request.user

        # Calculate the start and end date for the last 7 days
        end_date = timezone.now()
        start_date = end_date - timedelta(days=7)

        # How many tasks were completed in the last 7 days
        completed_last_7_days = Todo.objects.filter(
            user=user,
            completed=True,
            completion_date__gte=start_date,
            completion_date__lte=end_date
        ).count()

        # Task assign last week compared with this week
        tasks_assigned_last_week = Todo.objects.filter(
            user=user,
            creation_date__range = (start_date, start_date - timedelta(days=7))
        )

        tasks_assigned_this_week = Todo.objects.filter(
            user=user,
            creation_date__range = (start_date, end_date)
        ).count()

        # Completed tasks from last week compared with this week
        completed_last_week = Todo.objects.filter(
            user=user,
            completed=True,
            completion_date__gte=start_date - timedelta(days=7),
            completion_date__lte=start_date
        ).count()

        completed_this_week = Todo.objects.filter(
            user=user,
            completed=True,
            completion_date__gte=start_date,
            completion_date__lte=end_date
        ).count()

        overdue_tasks = Todo.objects.filter(
            user=user,
            completed=False,
            end_event__lt=timezone.now()
        ).count()

        # Overall completion rate
        total_tasks = Todo.objects.filter(user=user).count()
        overall_completion_rate = (completed_last_7_days / total_tasks) * 100 if total_tasks > 0 else 0
        
        total_completed_tasks = Todo.objects.filter(user=user, completed=True).count()

        total_tasks = Todo.objects.filter(user=user).count()

        today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        today_end = timezone.now().replace(hour=23, minute=59, second=59, microsecond=999999)

        tasks_completed_today = Todo.objects.filter(
            user=user,
            completed=True,
            completion_date__gte=today_start,
            completion_date__lte=today_end
        ).count()

        data = {
            "completed_last_7_days": completed_last_7_days,
            "tasks_assigned_last_week": tasks_assigned_last_week,
            "tasks_assigned_this_week": tasks_assigned_this_week,
            "completed_last_week": completed_last_week,
            "completed_this_week": completed_this_week,
            "overdue_tasks": overdue_tasks,
            "overall_completion_rate": overall_completion_rate,
            "total_completed_tasks": total_completed_tasks,
            "total_tasks" : total_tasks,
            "total_tasks_today": total_tasks_today,
            "tasks_completed_today": tasks_completed_today,
        }

        return Response(data, status=status.HTTP_200_OK)


class DashboardWeeklyViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Todo.objects.all()

    def list(self, request, *args, **kwargs):
        user = self.request.user

        # Calculate the start and end date for the last 7 days (Monday to Sunday)
        today = timezone.now().date()
        current_week_start = today - timedelta(days=today.weekday())
        current_week_end = current_week_start + timedelta(days=6)

        last_week_start = current_week_start - timedelta(days=7)
        last_week_end = last_week_start + timedelta(days=6)

        # Create a list to store daily statistics
        weekly_stats = []

        # Iterate over each day of the week
        for day in range(7):
            current_day = current_week_start + timedelta(days=day)
            last_day = last_week_start + timedelta(days=day)

            # Calculate stats for this week
            tasks_this_week = Todo.objects.filter(
                user=user,
                completion_date__gte=current_day,
                completion_date__lte=current_day + timedelta(days=1)
            ).count()

            completed_this_week = Todo.objects.filter(
                user=user,
                completed=True,
                completion_date__gte=current_day,
                completion_date__lte=current_day + timedelta(days=1)
            ).count()

            # Calculate stats for last week
            tasks_last_week = Todo.objects.filter(
                user=user,
                completion_date__gte=last_day,
                completion_date__lte=last_day + timedelta(days=1)
            ).count()

            completed_last_week = Todo.objects.filter(
                user=user,
                completed=True,
                completion_date__gte=last_day,
                completion_date__lte=last_day + timedelta(days=1)
            ).count()

            daily_stat = {
                "date": current_day.strftime("%A"),
                "This Week": tasks_this_week,
                "Last Week": tasks_last_week,
                "Completed This Week": completed_this_week,
                "Completed Last Week": completed_last_week,
            }

            weekly_stats.append(daily_stat)

        return Response(weekly_stats, status=status.HTTP_200_OK)

class DashboardStatsReccurenceViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    """
    A viewset for retrieving statistics related to user tasks for the last 7 days.
    """
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return RecurrenceTask.objects.all()

    def list(self, request, *args, **kwargs):
        user = self.request.user

        # Calculate the start and end date for the last 7 days
        end_date = timezone.now()
        start_date = end_date - timedelta(days=7)

        # How many tasks were completed in the last 7 days
        completed_last_7_days = RecurrenceTask.objects.filter(
            user=user,
            completed=True,
            completion_date__gte=start_date,
            completion_date__lte=end_date
        ).count()

        # Task assign last week compared with this week
        tasks_assigned_last_week = RecurrenceTask.objects.filter(
            user=user,
            completion_date__gte=start_date - timedelta(days=7),
            completion_date__lte=start_date
        ).count()

        tasks_assigned_this_week = RecurrenceTask.objects.filter(
            user=user,
            completion_date__gte=start_date,
            completion_date__lte=end_date
        ).count()

        # Completed tasks from last week compared with this week
        completed_last_week = RecurrenceTask.objects.filter(
            user=user,
            completed=True,
            completion_date__gte=start_date - timedelta(days=7),
            completion_date__lte=start_date
        ).count()

        completed_this_week = RecurrenceTask.objects.filter(
            user=user,
            completed=True,
            completion_date__gte=start_date,
            completion_date__lte=end_date
        ).count()

        overdue_tasks = RecurrenceTask.objects.filter(
            user=user,
            completed=False,
            end_event__lt=timezone.now()
        ).count()

        # Overall completion rate
        total_tasks = RecurrenceTask.objects.filter(user=user).count()
        overall_completion_rate = (completed_last_7_days / total_tasks) * 100 if total_tasks > 0 else 0
        
        total_completed_tasks = RecurrenceTask.objects.filter(
            user=user, 
            completed=True
        ).count()

        total_tasks = RecurrenceTask.objects.filter(user=user).count()

        tasks_completed_today = RecurrenceTask.objects.filter(
            user=user,
            completed=True,
            completion_date__gte=timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        ).count()

        data = {
            "completed_last_7_days": completed_last_7_days,
            "tasks_assigned_last_week": tasks_assigned_last_week,
            "tasks_assigned_this_week": tasks_assigned_this_week,
            "completed_last_week": completed_last_week,
            "completed_this_week": completed_this_week,
            "overdue_tasks": overdue_tasks,
            "overall_completion_rate": overall_completion_rate,
            "total_completed_tasks": total_completed_tasks,
            "total_tasks" : total_tasks,
            "tasks_completed_today": tasks_completed_today,
        }

        return Response(data, status=status.HTTP_200_OK)
    
# class DashboardStatsAllViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return Todo.objects.filter(user=self.request.user)

#     def list(self, request, *args, **kwargs):
#         user = request.user

#         # Calculate task usage statistics
#         todo_count = self.get_queryset().count()
#         recurrence_task_count = RecurrenceTask.objects.filter(user=user).count()

#         # Calculate how many tasks were completed in the last 7 days
#         completed_todo_count_last_week = Todo.objects.filter(user=user, completed=True, last_update__gte=timezone.now() - timezone.timedelta(days=7)).count()
#         completed_recurrence_task_count_last_week = RecurrenceTask.objects.filter(user=user, completed=True, last_update__gte=timezone.now() - timezone.timedelta(days=7)).count()

#         # Calculate subtask completion rate
#         total_subtasks = Todo.objects.filter(user=user).aggregate(total=Count('subtask__id'))['total']
#         completed_subtasks = Todo.objects.filter(user=user, subtask__completed=True).aggregate(total=Count('subtask__id'))['total']

#         # Calculate overall completion rate
#         total_tasks = todo_count + recurrence_task_count
#         completed_tasks = completed_todo_count_last_week + completed_recurrence_task_count_last_week
#         overall_completion_rate = (completed_tasks / total_tasks) * 100 if total_tasks > 0 else 0

#         # pie chart show
#         complete_todo_percent_last_week =  (completed_todo_count_last_week / todo_count) * 100 if todo_count > 0 else 0
#         complete_recurrence_percent_last_week = (completed_recurrence_task_count_last_week / recurrence_task_count) * 100 if recurrence_task_count > 0 else 0
#         incomplete_task_percent_last_week = 100 -  complete_recurrence_percent_last_week - complete_todo_percent_last_week

#         data = {
#             'todo_count': todo_count,
#             'recurrence_task_count': recurrence_task_count,
#             'completed_todo_count_last_week': completed_todo_count_last_week,
#             'completed_recurrence_task_count_last_week': completed_recurrence_task_count_last_week,
#             'total_subtasks': total_subtasks,
#             'completed_subtasks': completed_subtasks,
#             'overall_completion_rate': overall_completion_rate,
#             'complete_todo_percent_last_week': complete_todo_percent_last_week,
#             'complete_recurrence_percent_last_week' : complete_recurrence_percent_last_week,
#             'incomplete_task_percent_last_week': incomplete_task_percent_last_week,
#         }

#         return Response(data, status=status.HTTP_200_OK)
    
# class DashboardStatsAPIView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user

#         # Calculate task usage statistics
#         todo_count = Todo.objects.filter(user=user).count()
#         recurrence_task_count = RecurrenceTask.objects.filter(user=user).count()

#         # Calculate how many tasks were completed in the last 7 days
#         completed_todo_count_last_week = Todo.objects.filter(user=user, completed=True, last_update__gte=timezone.now() - timezone.timedelta(days=7)).count()
#         completed_recurrence_task_count_last_week = RecurrenceTask.objects.filter(user=user, completed=True, last_update__gte=timezone.now() - timezone.timedelta(days=7)).count()

#         # Calculate subtask completion rate
#         total_subtasks = Todo.objects.filter(user=user).aggregate(total=Count('subtask__id'))['total']
#         completed_subtasks = Todo.objects.filter(user=user, subtask__completed=True).aggregate(total=Count('subtask__id'))['total']

#         # Calculate overall completion rate
#         total_tasks = todo_count + recurrence_task_count
#         completed_tasks = completed_todo_count_last_week + completed_recurrence_task_count_last_week
#         overall_completion_rate = (completed_tasks / total_tasks) * 100 if total_tasks > 0 else 0

#         # pie chart show
#         complete_todo_percent_last_week =  (completed_todo_count_last_week / todo_count) * 100 if todo_count > 0 else 0

#         complete_recurrence_percent_last_week = (completed_recurrence_task_count_last_week / recurrence_task_count) * 100 if recurrence_task_count > 0 else 0

#         incomplete_task_percent_last_week = 100 -  complete_recurrence_percent_last_week - complete_todo_percent_last_week

#         data = {
#             'todo_count': todo_count,
#             'recurrence_task_count': recurrence_task_count,
#             'completed_todo_count_last_week': completed_todo_count_last_week,
#             'completed_recurrence_task_count_last_week': completed_recurrence_task_count_last_week,
#             'total_subtasks': total_subtasks,
#             'completed_subtasks': completed_subtasks,
#             'overall_completion_rate': overall_completion_rate,
#             'complete_todo_percent_last_week': complete_todo_percent_last_week,
#             'complete_recurrence_percent_last_week' : complete_recurrence_percent_last_week,
#             'incomplete_task_percent_last_week': incomplete_task_percent_last_week,

#         }

#         return Response(data, status=status.HTTP_200_OK)
    
#     def post(self, request):
#         # Handle incoming data from the POST request
#         # Update the necessary information based on the data

#         task_id = request.data.get('task_id')
#         is_completed = request.data.get('is_completed')

#         try:
#             task = Todo.objects.get(id=task_id, user=request.user)
#             task.completed = is_completed
#             task.save()
#             return Response({'message': 'Task completion status updated successfully'}, status=status.HTTP_200_OK)
#         except Todo.DoesNotExist:
#             return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)
    
# class WeeklyStatsAPIView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user
#         today = timezone.now()

#         # Calculate the start and end dates for the current week
#         current_week_start = today - timezone.timedelta(days=today.weekday())
#         current_week_end = current_week_start + timezone.timedelta(days=6)

#         # Initialize a list to store daily statistics
#         weekly_stats = []

#         # Loop through each day of the week
#         for i in range(7):
#             # Calculate the start and end dates for the current day
#             current_day_start = current_week_start + timezone.timedelta(days=i)
#             current_day_end = current_day_start + timezone.timedelta(days=1)

#             # Calculate the start and end dates for the same day over the last 7 days
#             last_7_days_start = current_day_start - timezone.timedelta(days=7)
#             last_7_days_end = current_day_end - timezone.timedelta(days=7)

#             # Calculate statistics for the current day
#             current_day_stats = self.calculate_stats(user, current_day_start, current_day_end)

#             # Calculate statistics for the same day over the last 7 days
#             last_7_days_stats = self.calculate_stats(user, last_7_days_start, last_7_days_end)

#             # Calculate the percentage change
#             percent_change_over_all = self.calculate_percent_change(
#                 current_day_stats['overall_completion_rate'],
#                 last_7_days_stats['overall_completion_rate']
#             )

#             # Calculate percentage change for completed_todo_count
#             percent_change_todo = self.calculate_percent_change(
#                 current_day_stats['completed_todo_count'],
#                 last_7_days_stats['completed_todo_count']
#             )

#             # Calculate percentage change for completed_recurrence_task_count
#             percent_change_recurrence = self.calculate_percent_change(
#                 current_day_stats['completed_recurrence_task_count'],
#                 last_7_days_stats['completed_recurrence_task_count']
#             )

#             # Append the daily statistics to the list
#             weekly_stats.append({
#                 'day_of_week': current_day_start.strftime('%A'),
#                 'current_day_stats': current_day_stats,
#                 'last_7_days_stats': last_7_days_stats,
#                 'percent_change_over_all': percent_change_over_all,
#                 'percent_change_todo': percent_change_todo,
#                 'percent_change_recurrence': percent_change_recurrence,
#             })

#         response_data = {
#             'weekly_stats': weekly_stats,
#         }

#         return Response(response_data, status=status.HTTP_200_OK)

#     def calculate_stats(self, user, start_date, end_date):
#         # Calculate task usage statistics for the specified day
#         todo_count = Todo.objects.filter(user=user, created_at__gte=start_date, created_at__lte=end_date).count()
#         recurrence_task_count = RecurrenceTask.objects.filter(user=user, created_at__gte=start_date, created_at__lte=end_date).count()

#         # Calculate how many tasks were completed on the specified day
#         completed_todo_count = Todo.objects.filter(user=user, completed=True, last_update__gte=start_date, last_update__lte=end_date).count()
#         completed_recurrence_task_count = RecurrenceTask.objects.filter(user=user, completed=True, last_update__gte=start_date, last_update__lte=end_date).count()

#         # Calculate subtask completion rate for the specified day
#         total_subtasks = Todo.objects.filter(user=user, created_at__gte=start_date, created_at__lte=end_date).aggregate(total=Count('subtask__id'))['total']
#         completed_subtasks = Todo.objects.filter(user=user, subtask__completed=True, created_at__gte=start_date, created_at__lte=end_date).aggregate(total=Count('subtask__id'))['total']

#         # Calculate overall completion rate for the specified day
#         total_tasks = todo_count + recurrence_task_count
#         completed_tasks = completed_todo_count + completed_recurrence_task_count
#         overall_completion_rate = (completed_tasks / total_tasks) * 100 if total_tasks > 0 else 0

#         return {
#             'start_date': start_date.strftime('%Y-%m-%d'),
#             'end_date': end_date.strftime('%Y-%m-%d'),
#             'todo_count': todo_count,
#             'recurrence_task_count': recurrence_task_count,
#             'completed_todo_count': completed_todo_count,
#             'completed_recurrence_task_count': completed_recurrence_task_count,
#             'total_subtasks': total_subtasks,
#             'completed_subtasks': completed_subtasks,
#             'overall_completion_rate': overall_completion_rate,
#         }

#     def calculate_percent_change(self, current_value, last_value):
#         # Calculate the percentage change between current and last values
#         if last_value != 0:
#             percent_change = ((current_value - last_value) / last_value) * 100
#         else:
#             percent_change = current_value * 100  # Consider infinite change when the last value is zero

#         return round(percent_change, 2)
