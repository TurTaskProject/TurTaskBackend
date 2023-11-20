# tasks/tests.py
from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.test import APIClient
from tasks.models import Todo, RecurrenceTask

class DashboardStatsAPITestCase(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(username='testuser', password='testpassword')

        # Create test tasks
        self.todo = Todo.objects.create(user=self.user, title='Test Todo', created_at=timezone.now())
        self.recurrence_task = RecurrenceTask.objects.create(user=self.user, title='Test Recurrence Task', created_at=timezone.now())

        # Create an API client
        self.client = APIClient()

    def test_dashboard_stats_api(self):
        # Authenticate the user
        self.client.force_authenticate(user=self.user)

        # Make a GET request to the DashboardStatsAPIView
        response = self.client.get('/api/dashboard-stats/')

        # Assert the response status code is 200
        self.assertEqual(response.status_code, 200)

        # Add more assertions based on your expected response data

    def test_task_completion_status_update(self):
        # Authenticate the user
        self.client.force_authenticate(user=self.user)

        # Make a POST request to update the completion status of a task
        data = {'task_id': self.todo.id, 'is_completed': True}
        response = self.client.post('/api/dashboard-stats/', data, format='json')

        # Assert the response status code is 200
        self.assertEqual(response.status_code, 200)

        # Assert the message in the response
        self.assertEqual(response.data['message'], 'Task completion status updated successfully')

        # Refresh the todo instance from the database and assert the completion status
        self.todo.refresh_from_db()
        self.assertTrue(self.todo.completed)

        # Add more assertions based on your expected response data

class WeeklyStatsAPITestCase(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(username='testuser', password='testpassword')

        # Create an API client
        self.client = APIClient()

    def test_weekly_stats_api(self):
        # Authenticate the user
        self.client.force_authenticate(user=self.user)

        # Make a GET request to the WeeklyStatsAPIView
        response = self.client.get('/api/weekly-stats/')

        # Assert the response status code is 200
        self.assertEqual(response.status_code, 200)

        # Add more assertions based on your expected response data

# Add more test cases as needed
