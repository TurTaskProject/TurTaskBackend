from datetime import datetime, timedelta
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from tasks.tests.utils import create_test_user
from tasks.models import Todo
from boards.models import ListBoard, Board


class TodoSignalHandlersTests(APITestCase):
    def setUp(self):
        self.user = create_test_user()
        self.client.force_authenticate(user=self.user)
        self.list_board = Board.objects.get(user=self.user).listboard_set.first()

    def test_update_priority_signal_handler(self):
        """
        Test the behavior of the update_priority signal handler.
        """
        due_date = datetime.now() + timedelta(days=5)
        data = {
            'title': 'Test Task',
            'type': 'habit',
            'difficulty': 1,
            'end_event': due_date.strftime('%Y-%m-%dT%H:%M:%S'),
            'list_board': self.list_board.id,
        }
        response = self.client.post(reverse("todo-list"), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Retrieve the created task and check if priority is updated
        task = Todo.objects.get(title='Test Task')
        self.assertIsNotNone(task.priority)  # Check if priority is not None