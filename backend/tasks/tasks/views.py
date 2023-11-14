from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from tasks.models import Todo, RecurrenceTask, Habit
from tasks.tasks.serializers import (TaskCreateSerializer,
                                     TaskSerializer,
                                     RecurrenceTaskSerializer,
                                     RecurrenceTaskCreateSerializer,
                                     HabitTaskSerializer,
                                     HabitTaskCreateSerializer)


class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Todo.objects.filter(user=self.request.user)
        return queryset

    def get_serializer_class(self):
        # Can't add ManytoMany at creation time (Tags)
        if self.action == 'create':
            return TaskCreateSerializer
        return TaskSerializer
    

class RecurrenceTaskViewSet(viewsets.ModelViewSet):
    queryset = RecurrenceTask.objects.all()
    serializer_class = RecurrenceTaskSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        # Can't add ManytoMany at creation time (Tags)
        if self.action == 'create':
            return RecurrenceTaskCreateSerializer
        return RecurrenceTaskSerializer


class HabitTaskViewSet(viewsets.ModelViewSet):
    queryset = Habit.objects.all()
    serializer_class = HabitTaskSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        # Can't add ManytoMany at creation time (Tags)
        if self.action == 'create':
            return HabitTaskCreateSerializer
        return HabitTaskSerializer