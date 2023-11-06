from rest_framework import serializers
from ..models import Todo

class TaskCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        # fields = '__all__'
        exclude = ('tags',)

    def create(self, validated_data):
        # Create a new task with validated data
        return Todo.objects.create(**validated_data)
    
class TaskGeneralSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = '__all__'

    def create(self, validated_data):
        # Create a new task with validated data
        return Todo.objects.create(**validated_data)