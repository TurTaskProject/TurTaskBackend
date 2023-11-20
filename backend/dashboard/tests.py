# # tasks/tests.py
# from django.test import TestCase
# from django.utils import timezone
# from rest_framework.test import APIClient
# from tasks.models import Todo, RecurrenceTask
# from tasks.tests.utils import create_test_user
# from django.urls import reverse

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
