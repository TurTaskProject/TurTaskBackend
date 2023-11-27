from rest_framework import serializers
from users.models import CustomUser
from boards.models import ListBoard
from tasks.models import Todo, RecurrenceTask, Habit, Subtask

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = '__all__'

    def create(self, validated_data):
        user_id = validated_data.get('user')

        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("User with the provided ID does not exist.")

        validated_data['user'] = user
        return Todo.objects.create(**validated_data)

class TaskCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        exclude = ('tags', 'google_calendar_id', 'creation_date', 'last_update',)

class ChangeTaskOrderSerializer(serializers.Serializer):
    list_board_id = serializers.IntegerField(
        help_text='ID of the ListBoard for which the task order should be updated.'
    )
    todo_order = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        help_text='New order of Todo IDs in the ListBoard.'
    )

    def validate(self, data):
        list_board_id = data.get('list_board_id')
        todo_order = data.get('todo_order', [])

        if not ListBoard.objects.filter(id=list_board_id).exists():
            raise serializers.ValidationError('ListBoard does not exist.')

        existing_tasks = Todo.objects.filter(id__in=todo_order)
        existing_task_ids = set(task.id for task in existing_tasks)

        non_existing_task_ids = set(todo_order) - existing_task_ids

        if non_existing_task_ids:
            raise serializers.ValidationError(f'Tasks with IDs {non_existing_task_ids} do not exist.')

        return data

class ChangeTaskListBoardSerializer(serializers.Serializer):
    todo_id = serializers.IntegerField()
    new_list_board_id = serializers.IntegerField()
    new_index = serializers.IntegerField(required=False)

    def validate(self, data):
        todo_id = data.get('todo_id')
        new_list_board_id = data.get('new_list_board_id')
        new_index = data.get('new_index')

        if not Todo.objects.filter(id=todo_id, user=self.context['request'].user).exists():
            raise serializers.ValidationError('Todo does not exist for the authenticated user.')

        if not ListBoard.objects.filter(id=new_list_board_id).exists():
            raise serializers.ValidationError('ListBoard does not exist.')

        return data

class RecurrenceTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecurrenceTask
        fields = '__all__'

    def create(self, validated_data):
        # Create a new task with validated data
        return Todo.objects.create(**validated_data)
    
class RecurrenceTaskCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecurrenceTask
        exclude = ('tags',)


class HabitTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habit
        fields = '__all__'

    def create(self, validated_data):
        # Create a new task with validated data
        return Todo.objects.create(**validated_data)


class HabitTaskCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habit
        exclude = ('tags',)


class SubTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtask
        fields = '__all__'

    def create(self, validated_data):
        # Create a new task with validated data
        return Todo.objects.create(**validated_data)