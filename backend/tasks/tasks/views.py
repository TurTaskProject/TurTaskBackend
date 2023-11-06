from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, RetrieveAPIView, RetrieveUpdateAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from ..models import Todo
from .serializers import TaskCreateSerializer, TaskGeneralSerializer

class TaskCreateView(CreateAPIView):
    queryset = Todo.objects.all()
    serializer_class = TaskCreateSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TaskRetrieveView(RetrieveAPIView):
    queryset = Todo.objects.all()
    serializer_class = TaskGeneralSerializer
    permission_classes = [IsAuthenticated]


class TaskUpdateView(RetrieveUpdateAPIView):
    queryset = Todo.objects.all()
    serializer_class = TaskGeneralSerializer
    permission_classes = [IsAuthenticated]


class TaskDeleteView(DestroyAPIView):
    queryset = Todo.objects.all()
    permission_classes = [IsAuthenticated]