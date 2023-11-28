from datetime import datetime, timedelta
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from tasks.tests.utils import create_test_user
from tasks.models import Todo
from boards.models import ListBoard, Board


class TodoViewSetTests(APITestCase):
    def setUp(self):
        self.user = create_test_user()
        self.client.force_authenticate(user=self.user)
        self.url = reverse("todo-list")
        self.due_date = datetime.now() + timedelta(days=5)
        self.list_board = Board.objects.get(user=self.user).listboard_set.first()

    def test_create_valid_todo(self):
        """
        Test creating a valid task using the API.
        """
        data = {
            'title': 'Test Task',
            'type': 'habit',
            'difficulty': 1,
            'end_event': self.due_date.strftime('%Y-%m-%dT%H:%M:%S'),
            'list_board': self.list_board.id,
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Todo.objects.count(), 1)
        self.assertEqual(Todo.objects.get().title, 'Test Task')

    def test_create_invalid_todo(self):
        """
        Test creating an invalid task using the API.
        """
        data = {
            'type': 'invalid',  # Invalid task type
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertEqual(Todo.objects.count(), 0)  # No task should be created

    def test_missing_required_fields(self):
        """
        Test creating a task with missing required fields using the API.
        """
        data = {
            'type': 'habit',
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertEqual(Todo.objects.count(), 0)  # No task should be created

    def test_invalid_user_id(self):
        """
        Test creating a task with an invalid user ID using the API (OK because we retreive)
        id from request.
        """
        data = {
            'title': 'Test Task',
            'type': 'habit',
            'exp': 10,
            'priority': 1,
            'difficulty': 1,
            'user': -100,  # Invalid user ID
            'end_event': self.due_date.strftime('%Y-%m-%dT%H:%M:%S'),
            'list_board': self.list_board.id,
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Todo.objects.count(), 1)  # No task should be created
