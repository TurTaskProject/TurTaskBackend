from rest_framework import serializers
from ..models import Task

class TaskCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        # fields = '__all__'
        exclude = ('tags', 'reminders')

    def create(self, validated_data):
        # Create a new task with validated data
        return Task.objects.create(**validated_data)
    
class TaskGeneralSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

    def create(self, validated_data):
        # Create a new task with validated data
        return Task.objects.create(**validated_data)