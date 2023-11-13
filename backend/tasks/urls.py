from django.urls import path, include

from rest_framework.routers import DefaultRouter

from tasks.api import GoogleCalendarEventViewset
from tasks.tasks.views import TodoViewSet, RecurrenceTaskViewSet, HabitTaskViewSet
from tasks.misc.views import TagViewSet


router = DefaultRouter()
router.register(r'todo', TodoViewSet)
router.register(r'daily', RecurrenceTaskViewSet)
router.register(r'habit', HabitTaskViewSet)
router.register(r'tags', TagViewSet)
router.register(r'calendar-events', GoogleCalendarEventViewset, basename='calendar-events')

urlpatterns = [
    path('', include(router.urls)),
]