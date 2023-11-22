from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import DashboardStatsTodoViewSet, DashboardWeeklyViewSet

router = DefaultRouter()
router.register(r'dashboard/stats', DashboardStatsTodoViewSet, basename='statstodo')
router.register(r'dashboard/weekly', DashboardWeeklyViewSet, basename='weekly')
router.register(r'dashboard/stats', DashboardStatsTodoViewSet, basename='statsrec')
urlpatterns = [
    path('', include(router.urls)),
]
