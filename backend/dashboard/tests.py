from rest_framework.test import APITestCase
from django.urls import reverse
from tasks.models import Todo
from django.utils import timezone
from datetime import timedelta

from boards.models import Board
from tasks.tests.utils import create_test_user

class DashboardStatsAndWeeklyViewSetTests(APITestCase):
    def setUp(self):
        self.user = create_test_user()
        self.client.force_authenticate(user=self.user)
        self.list_board = Board.objects.get(user=self.user).listboard_set.first()

    def _create_task(self, title, completed=False, completion_date=None, end_event=None):
        return Todo.objects.create(
            user=self.user,
            title=title,
            completed=completed,
            completion_date=completion_date,
            end_event=end_event,
            list_board=self.list_board
        )

    def test_dashboard_stats_view(self):
        # Create tasks for testing
        self._create_task('Task 1', completed=True)
        self._create_task('Task 2', end_event=timezone.now() - timedelta(days=8))
        self._create_task('Task 3', end_event=timezone.now())
        
        response = self.client.get(reverse('statstodo-list'))
        self.assertEqual(response.status_code, 200)
        
        self.assertEqual(response.data['completed_this_week'], 1)
        self.assertEqual(response.data['tasks_assigned_this_week'], 1)
        self.assertEqual(response.data['tasks_assigned_last_week'], 0)

    def test_dashboard_weekly_view(self):
        # Create tasks for testing
        self._create_task('Task 1', completion_date=timezone.now() - timedelta(days=1))
        self._create_task('Task 2', end_event=timezone.now() - timedelta(days=8))
        self._create_task('Task 3', end_event=timezone.now())
        
        response = self.client.get(reverse('weekly-list'))
        self.assertEqual(response.status_code, 200)
