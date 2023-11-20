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

        data = {
            'todo_count': todo_count,
            'recurrence_task_count': recurrence_task_count,
            'completed_todo_count_last_week': completed_todo_count_last_week,
            'completed_recurrence_task_count_last_week': completed_recurrence_task_count_last_week,
            'total_subtasks': total_subtasks,
            'completed_subtasks': completed_subtasks,
            'overall_completion_rate': overall_completion_rate,
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