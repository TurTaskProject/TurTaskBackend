from django.urls import path
from .views import DashboardStatsAPIView, WeeklyStatsAPIView

urlpatterns = [
    path('dashboard/stats/', DashboardStatsAPIView.as_view(), name='dashboard-stats'),
    path('dashboard/weekly-stats/', WeeklyStatsAPIView.as_view(), name='dashboard-weekly-stats'),
]
