from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import DashboardStatsViewSet, DashboardWeeklyViewSet

router = DefaultRouter()
router.register(r'dashboard/stats', DashboardStatsViewSet, basename='stats')
router.register(r'dashboard/weekly', DashboardWeeklyViewSet, basename='weekly')
urlpatterns = [
    path('', include(router.urls)),
]
