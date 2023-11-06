from datetime import datetime, timedelta

from django.utils import timezone

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from tasks.utils import get_service
from tasks.models import Todo
from tasks.serializers import TaskUpdateSerializer


class GoogleCalendarEventViewset(viewsets.ViewSet):
    permission_classes = (IsAuthenticated,)

    def __init__(self, *args, **kwargs):
        super().__init__()
        self.current_time = datetime.now(tz=timezone.utc).isoformat()
        self.event_fields = 'items(id,summary,description,created,updated,start,end)'

    def _validate_serializer(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response("Task Sync Successfully", status=200)
        return Response(serializer.errors, status=400)

    def post(self, request):
        service = get_service(request)
        events = service.events().list(calendarId='primary', fields=self.event_fields).execute()
        for event in events.get('items', []):
            try:
                task = Todo.objects.get(google_calendar_id=event['id'])
                serializer = TaskUpdateSerializer(instance=task, data=event)
                return self._validate_serializer(serializer)
            except Todo.DoesNotExist:
                serializer = TaskUpdateSerializer(data=event, user=request.user)
                return self._validate_serializer(serializer)
                
    def list(self, request, days=7):
        max_time = (datetime.now(tz=timezone.utc) + timedelta(days=3)).isoformat()
        
        service = get_service(request)
        events = []
        next_page_token = None

        while True:
            query = service.events().list(
                calendarId='primary',
                timeMin=self.current_time,
                timeMax=max_time,
                maxResults=20,
                singleEvents=True,
                orderBy='startTime',
                pageToken=next_page_token,
                fields='items(id,summary,description,created,updated,start,end)',
            )

            page_results = query.execute()
            page_events = page_results.get('items', [])

            events.extend(page_events)
            next_page_token = page_results.get('nextPageToken')

            if next_page_token is None:
                break

        return Response(events, status=200)