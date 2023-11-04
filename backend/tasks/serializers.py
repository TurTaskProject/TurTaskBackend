from rest_framework import serializers
from django.utils.dateparse import parse_datetime
from .models import Task


class GoogleCalendarEventSerializer(serializers.Serializer):
    summary = serializers.CharField()
    start = serializers.DateTimeField()
    end = serializers.DateTimeField()
    description = serializers.CharField(required=False)


class TaskUpdateSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="google_calendar_id")
    summary = serializers.CharField(source="title")
    description = serializers.CharField(source="notes", required=False)
    created = serializers.DateTimeField(source="creation_date")
    updated = serializers.DateTimeField(source="last_update")
    start_datetime = serializers.DateTimeField(source="start_event", required=False)
    end_datetime = serializers.DateTimeField(source="end_event", required=False)


    class Meta:
        model = Task
        fields = ('id', 'summary', 'description', 'created', 'updated', 'start_datetime', 'end_datetime')

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        super(TaskUpdateSerializer, self).__init__(*args, **kwargs)

    def create(self, validated_data):
        validated_data['user'] = self.user
        task = Task.objects.create(**validated_data)

        return task