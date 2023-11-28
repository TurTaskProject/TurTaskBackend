from datetime import datetime, timedelta, timezone
from rest_framework.test import APITestCase
from tasks.models import Todo
from tasks.tests.utils import create_test_user
from boards.models import Board

class TodoPriorityTest(APITestCase):
    def setUp(self):
        self.user = create_test_user()
        self.client.force_authenticate(user=self.user)
        self.list_board = Board.objects.get(user=self.user).listboard_set.first()

    def test_priority_calculation(self):
        # Important = 2, Till Due = none
        todo = Todo(importance=2, end_event=None, user=self.user, list_board=self.list_board)
        todo.save()
        # 'Not Important & Not Urgent'
        self.assertEqual(todo.priority, Todo.EisenhowerMatrix.NOT_IMPORTANT_NOT_URGENT)

        due_date = datetime.now(timezone.utc) + timedelta(days=1)
        # Important = 4, Till Due = 1
        todo = Todo(importance=4, end_event=due_date, user=self.user, list_board=self.list_board)
        todo.save()
        # 'Important & Urgent'
        self.assertEqual(todo.priority, Todo.EisenhowerMatrix.IMPORTANT_URGENT)

        due_date = datetime.now(timezone.utc) + timedelta(days=10)
        # Important = 3, Till Due = 10
        todo = Todo(importance=3, end_event=due_date, user=self.user, list_board=self.list_board)
        todo.save()
        # 'Important & Not Urgent'
        self.assertEqual(todo.priority, Todo.EisenhowerMatrix.IMPORTANT_NOT_URGENT)

        due_date = datetime.now(timezone.utc) + timedelta(days=2)
        # Important = 1, Till Due = 2
        todo = Todo(importance=1, end_event=due_date, user=self.user, list_board=self.list_board)
        todo.save()
        # 'Not Important & Urgent'
        self.assertEqual(todo.priority, Todo.EisenhowerMatrix.NOT_IMPORTANT_URGENT)
