from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from tasks.models import Todo
from .serializers import TaskCreateSerializer, TaskGeneralSerializer


class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TaskGeneralSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        # Can't add ManytoMany at creation time (Tags)
        if self.action == 'create':
            return TaskCreateSerializer
        return TaskGeneralSerializer