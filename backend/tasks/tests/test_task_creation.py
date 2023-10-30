from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .utils import create_test_user, login_user
from ..models import Task

class TaskCreateViewTests(APITestCase):
    def setUp(self):

        self.user = create_test_user()
        self.client = login_user(self.user)
        self.url = reverse("add-task")

    def test_create_valid_task(self):
        """
        Test creating a valid task using the API.
        """
        data = {
            'title': 'Test Task',
            'type': 'habit',
            'exp': 10,
            'attribute': 'str',
            'priority': 1.5,
            'difficulty': 1,
            'user': self.user.id,
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(), 1)
        self.assertEqual(Task.objects.get().title, 'Test Task')

    def test_create_invalid_task(self):
        """
        Test creating an invalid task using the API.
        """
        data = {
            'type': 'invalid',  # Invalid task type
        }

        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Task.objects.count(), 0)  # No task should be created

    def test_missing_required_fields(self):
        """
        Test creating a task with missing required fields using the API.
        """
        data = {
            'title': 'Incomplete Task',
            'type': 'habit',
        }

        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Task.objects.count(), 0)  # No task should be created

    def test_invalid_user_id(self):
        """
        Test creating a task with an invalid user ID using the API.
        """
        data = {
            'title': 'Test Task',
            'type': 'habit',
            'exp': 10,
            'priority': 1.5,
            'difficulty': 1,
            'user': 999,  # Invalid user ID
        }

        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Task.objects.count(), 0)  # No task should be created
