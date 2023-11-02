from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api import GoogleCalendarEventViewset
from .tasks.views import TaskCreateView, TaskRetrieveView, TaskUpdateView, TaskDeleteView
from .misc.views import TagViewSet, ReminderViewSet

router = DefaultRouter()
router.register(r'reminders', ReminderViewSet)
router.register(r'tags', TagViewSet)
router.register(r'calendar-events', GoogleCalendarEventViewset, basename='calendar-events')

urlpatterns = [
    path('', include(router.urls)),
    path('tasks/create/', TaskCreateView.as_view(), name="add-task"),
    path('tasks/<int:pk>/', TaskRetrieveView.as_view(), name='retrieve-task'),
    path('tasks/<int:pk>/update/', TaskUpdateView.as_view(), name='update-task'),
    path('tasks/<int:pk>/delete/', TaskDeleteView.as_view(), name='delete-task'),
]