from datetime import datetime, timedelta

from django.utils import timezone

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from tasks.utils import get_service
from tasks.models import Todo
from tasks.serializers import TodoUpdateSerializer

class GoogleCalendarEventViewset(viewsets.ViewSet):
    """Viewset for list or save Google Calendar Events."""
    permission_classes = (IsAuthenticated,)

    def __init__(self, *args, **kwargs):
        super().__init__()
        self.current_time = (datetime.now(tz=timezone.utc) + timedelta(days=-7)).isoformat()
        self.max_time = (datetime.now(tz=timezone.utc) + timedelta(days=7)).isoformat()
        self.event_fields = 'items(id,summary,description,created,recurringEventId,updated,start,end,originalStartTime)'

    def _get_google_events(self, request):
        """Get all events from Google Calendar. """
        service = get_service(request)
        events = []
        next_page_token = None

        while True:
            query = service.events().list(
                calendarId='primary',
                timeMin=self.current_time,
                timeMax=self.max_time,
                maxResults=200,
                singleEvents=True,
                orderBy='startTime',
                pageToken=next_page_token,
                fields=self.event_fields,
            )

            page_results = query.execute()
            page_events = page_results.get('items', [])
            
            events.extend(page_events)
            next_page_token = page_results.get('nextPageToken')

            if next_page_token is None:
                break

        return events

    def _validate_serializer(self, serializer):
        """
        Validate serializer and return response.
        
        :param serializer: The serializer to validate.
        """
        if serializer.is_valid():
            serializer.save()
            return Response("Validate Successfully", status=200)
        return Response(serializer.errors, status=400)

    def create(self, request, *args, **kwargs):
        """Create a new Google Calendar Event."""
        events = self._get_google_events(request)
        
        responses = []
        for event in events:
            start_datetime = event.get('start', {}).get('dateTime')
            end_datetime = event.get('end', {}).get('dateTime')

            event['start_datetime'] = start_datetime
            event['end_datetime'] = end_datetime
            event.pop('start')
            event.pop('end')

            try:
                task = Todo.objects.get(google_calendar_id=event['id'])
                serializer = TodoUpdateSerializer(instance=task, data=event)
            except Todo.DoesNotExist:
                serializer = TodoUpdateSerializer(data=event, user=request.user)

            responses.append(self._validate_serializer(serializer))

        return responses[0] if responses else Response("No events to process", status=200)

    def list(self, request):
        """List all Google Calendar Events."""
        return Response(self._get_google_events(request), status=200)
        