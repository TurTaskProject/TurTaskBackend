from rest_framework import serializers
from ..models import Todo, RecurrenceTask, Habit

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = '__all__'

    def create(self, validated_data):
        # Create a new task with validated data
        return Todo.objects.create(**validated_data)

class TaskCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        exclude = ('tags',)
    

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