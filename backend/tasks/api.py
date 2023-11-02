from datetime import datetime, timedelta
from django.utils import timezone

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from googleapiclient.discovery import build

from .serializers import GoogleCalendarEventSerializer
from users.access_token_cache import get_credential_from_cache_token


class GoogleCalendarEventViewset(viewsets.ViewSet):
    permission_classes = (IsAuthenticated,)

    def list(self, request, days=7):
        current_time = datetime.now(tz=timezone.utc).isoformat()
        max_time = (datetime.now(tz=timezone.utc) + timedelta(days=days)).isoformat()
        credentials = get_credential_from_cache_token(request.user.id)
        service = build('calendar', 'v3', credentials=credentials)
        events = service.events().list(calendarId='primary', timeMin=current_time, timeMax=max_time).execute()

        return Response(events.get('items', []), status=200)
