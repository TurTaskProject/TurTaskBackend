from django.shortcuts import get_object_or_404
from django.db import IntegrityError
from rest_framework import viewsets, status, serializers
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import mixins

from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter

from tasks.tasks.serializers import ChangeTaskListBoardSerializer, ChangeTaskOrderSerializer, SubTaskSerializer
from boards.models import ListBoard, KanbanTaskOrder
from tasks.models import Todo, RecurrenceTask, Habit, Subtask
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
    model = Todo

    def get_queryset(self):
        queryset = Todo.objects.filter(user=self.request.user)
        return queryset

    def get_serializer_class(self):
        # Can't add ManytoMany at creation time (Tags)
        if self.action == 'create':
            return TaskCreateSerializer
        return TaskSerializer

    def list(self, request, *args, **kwargs):
        """
        list all tasks of the authenticated 
        user and send tags if those Todo too.
        """
        try:
            queryset = self.get_queryset()
            serializer = TaskSerializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request, *args, **kwargs):
        try:
            new_task_data = request.data
            new_task_data['user'] = self.request.user.id
            serializer = self.get_serializer(data=new_task_data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        except IntegrityError as e:
            return Response({'error': 'IntegrityError - Duplicate Entry'}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['put'])
    def change_task_order(self, request):
        try:
            serializer = ChangeTaskOrderSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            list_board_id = serializer.validated_data['list_board_id']
            new_order = serializer.validated_data.get('todo_order', [])

            list_board = get_object_or_404(ListBoard, id=list_board_id)
            kanban_order, created = KanbanTaskOrder.objects.get_or_create(list_board=list_board)
            kanban_order.todo_order = new_order
            kanban_order.save()

            return Response({'message': 'Task order updated successfully'})

        except serializers.ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['put'])
    def change_task_list_board(self, request):
        try:
            serializer = ChangeTaskListBoardSerializer(data=request.data, context={'request': request})
            serializer.is_valid(raise_exception=True)

            todo_id = serializer.validated_data['todo_id']
            new_list_board_id = serializer.validated_data['new_list_board_id']
            new_index = serializer.validated_data.get('new_index')

            todo_id = request.data.get('todo_id')
            new_list_board_id = request.data.get('new_list_board_id')

            todo = get_object_or_404(Todo, id=todo_id, user=self.request.user)
            old_list_board = todo.list_board

            # Remove todoId from todo_order of the old list board
            old_kanban_order, _ = KanbanTaskOrder.objects.get_or_create(list_board=old_list_board)
            old_kanban_order.todo_order = [t_id for t_id in old_kanban_order.todo_order if t_id != todo.id]
            old_kanban_order.save()

            # Get the index to insert the todo in the new list board's todo_order
            new_list_board = get_object_or_404(ListBoard, id=new_list_board_id)
            new_kanban_order, _ = KanbanTaskOrder.objects.get_or_create(list_board=new_list_board)
            
            # Index where todo need to insert (start from 0)
            new_index = request.data.get('new_index', None)

            if new_index is not None and 0 <= new_index <= len(new_kanban_order.todo_order):
                new_kanban_order.todo_order.insert(new_index, todo.id)
            else:
                new_kanban_order.todo_order.append(todo.id)

            new_kanban_order.save()

            todo.list_board = new_list_board
            todo.save()

            return Response({'message': 'ListBoard updated successfully'})

        except serializers.ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@extend_schema_view(
list=extend_schema(
    parameters=[
        OpenApiParameter(name='parent_task', description='Parent Task ID', type=int),
        ]
    )
)
class SubTaskViewset(viewsets.GenericViewSet,
                     mixins.CreateModelMixin,
                     mixins.DestroyModelMixin,
                     mixins.ListModelMixin,
                     mixins.UpdateModelMixin):
    queryset = Subtask.objects.all()
    permission_classes = (IsAuthenticated,)

    def get_serializer_class(self):
        return SubTaskSerializer
    
    def list(self, request, *args, **kwargs):
        """List only subtask of parent task."""
        try:
            parent_task = request.query_params.get('parent_task')
            if not parent_task:
                raise serializers.ValidationError('parent_task is required.')
            queryset = self.get_queryset().filter(parent_task_id=parent_task)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request, *args, **kwargs):
        """Create a new subtask, point to some parent tasks."""
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def destroy(self, request, *args, **kwargs):
        """Delete a subtask."""
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def partial_update(self, request, *args, **kwargs):
        """Update a subtask."""
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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