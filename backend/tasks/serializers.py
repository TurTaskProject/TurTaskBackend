from rest_framework import serializers


class GoogleCalendarEventSerializer(serializers.Serializer):
    summary = serializers.CharField()
    start = serializers.DateTimeField()
    end = serializers.DateTimeField()
    description = serializers.CharField(required=False)