from django.test import TestCase
from django.urls import reverse
from tasks.models import Todo
from django.utils import timezone
from datetime import timedelta

from tasks.tests.utils import create_test_user, login_user

class DashboardStatsAndWeeklyViewSetTests(TestCase):
    def setUp(self):
        self.user = create_test_user()
        self.client = login_user(self.user)

    def create_task(self, title, completed=False, completion_date=None, end_event=None):
        return Todo.objects.create(
            user=self.user,
            title=title,
            completed=completed,
            completion_date=completion_date,
            end_event=end_event
        )

    def test_dashboard_stats_view(self):
        # Create tasks for testing
        self.create_task('Task 1', completed=True)
        self.create_task('Task 2', end_event=timezone.now() - timedelta(days=8))
        self.create_task('Task 3', end_event=timezone.now())
        
        response = self.client.get(reverse('stats-list'))
        self.assertEqual(response.status_code, 200)
        
        self.assertEqual(response.data['completed_this_week'], 1)
        self.assertEqual(response.data['tasks_assigned_this_week'], 1)
        self.assertEqual(response.data['tasks_assigned_last_week'], 0)

    def test_dashboard_weekly_view(self):
        # Create tasks for testing
        self.create_task('Task 1', completion_date=timezone.now() - timedelta(days=1))
        self.create_task('Task 2', end_event=timezone.now() - timedelta(days=8))
        self.create_task('Task 3', end_event=timezone.now())
        
        response = self.client.get(reverse('weekly-list'))
        self.assertEqual(response.status_code, 200)


# class DashboardStatsAPITestCase(TestCase):
#     def setUp(self):
#         # Create a test user
#         self.user = create_test_user()

#         # Create test tasks
#         self.todo = Todo.objects.create(user=self.user, title='Test Todo')
#         self.recurrence_task = RecurrenceTask.objects.create(user=self.user, title='Test Recurrence Task')

#         # Create an API client
#         self.client = APIClient()

#     def test_dashboard_stats_api(self):
#         # Authenticate the user
#         self.client.force_authenticate(user=self.user)

#         # Make a GET request to the DashboardStatsAPIView
#         response = self.client.get(reverse("dashboard-stats"))

#         # Assert the response status code is 200
#         self.assertEqual(response.status_code, 200)

#     def test_task_completion_status_update(self):
#         # Authenticate the user
#         self.client.force_authenticate(user=self.user)

#         # Make a POST request to update the completion status of a task
#         data = {'task_id': self.todo.id, 'is_completed': True}
#         response = self.client.post(reverse("dashboard-stats"), data, format='json')

#         # Assert the response status code is 200
#         self.assertEqual(response.status_code, 200)

#         # Assert the message in the response
#         self.assertEqual(response.data['message'], 'Task completion status updated successfully')

#         # Refresh the todo instance from the database and assert the completion status
#         self.todo.refresh_from_db()
#         self.assertTrue(self.todo.completed)


# class WeeklyStatsAPITestCase(TestCase):
#     def setUp(self):
#         # Create a test user
#         self.user = create_test_user()

#         # Create an API client
#         self.client = APIClient()

#     def test_weekly_stats_api(self):
#         # Authenticate the user
#         self.client.force_authenticate(user=self.user)

#         # Make a GET request to the WeeklyStatsAPIView
#         response = self.client.get(reverse('dashboard-weekly-stats'))

#         # Assert the response status code is 200
#         self.assertEqual(response.status_code, 200)
