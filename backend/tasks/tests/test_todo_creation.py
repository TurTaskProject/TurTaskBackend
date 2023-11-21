from datetime import datetime, timedelta
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from tasks.tests.utils import create_test_user, login_user
from tasks.models import Todo


# class TodoViewSetTests(APITestCase):
#     def setUp(self):
#         self.user = create_test_user()
#         self.client = login_user(self.user)
#         self.url = reverse("todo-list")
#         self.due_date = datetime.now() + timedelta(days=5)

#     def test_create_valid_todo(self):
#         """
#         Test creating a valid task using the API.
#         """
#         data = {
#             'title': 'Test Task',
#             'type': 'habit',
#             'exp': 10,
#             'attribute': 'str',
#             'priority': 1,
#             'difficulty': 1,
#             'user': self.user.id,
#             'end_event': self.due_date.strftime('%Y-%m-%dT%H:%M:%S'),
#         }
#         response = self.client.post(self.url, data, format='json')
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         self.assertEqual(Todo.objects.count(), 1)
#         self.assertEqual(Todo.objects.get().title, 'Test Task')

#     def test_create_invalid_todo(self):
#         """
#         Test creating an invalid task using the API.
#         """
#         data = {
#             'type': 'invalid',  # Invalid task type
#         }
#         response = self.client.post(self.url, data, format='json')
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
#         self.assertEqual(Todo.objects.count(), 0)  # No task should be created

#     def test_missing_required_fields(self):
#         """
#         Test creating a task with missing required fields using the API.
#         """
#         data = {
#             'title': 'Incomplete Task',
#             'type': 'habit',
#         }
#         response = self.client.post(self.url, data, format='json')
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
#         self.assertEqual(Todo.objects.count(), 0)  # No task should be created

#     def test_invalid_user_id(self):
#         """
#         Test creating a task with an invalid user ID using the API.
#         """
#         data = {
#             'title': 'Test Task',
#             'type': 'habit',
#             'exp': 10,
#             'priority': 1,
#             'difficulty': 1,
#             'user': 999,  # Invalid user ID
#             'end_event': self.due_date.strftime('%Y-%m-%dT%H:%M:%S'),
#         }
#         response = self.client.post(self.url, data, format='json')
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
#         self.assertEqual(Todo.objects.count(), 0)  # No task should be created
