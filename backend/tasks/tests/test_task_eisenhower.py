from datetime import datetime, timedelta, timezone

from django.test import TestCase

from tasks.models import Todo
from tasks.tests.utils import create_test_user

class TaskModelTest(TestCase):
    def setUp(self):
        self.user = create_test_user()

    def test_eisenhower_matrix_category(self):
        task = Todo(importance=2, end_event=None, user=self.user)
        task.save()

        # 'Not Important & Not Urgent' category (category 4)
        self.assertEqual(task.calculate_eisenhower_matrix_category(), 4)

        due_date = datetime.now(timezone.utc) + timedelta(days=1)
        task = Todo(importance=4, end_event=due_date, user=self.user)
        task.save()

        # 'Important & Urgent' category (category 1)
        self.assertEqual(task.calculate_eisenhower_matrix_category(), 1)

        due_date = datetime.now(timezone.utc) + timedelta(days=10)
        task = Todo(importance=3, end_event=due_date, user=self.user)
        task.save()

        # 'Important & Not Urgent' category (category 2)
        self.assertEqual(task.calculate_eisenhower_matrix_category(), 2)

        due_date = datetime.now(timezone.utc) + timedelta(days=4)
        task = Todo(importance=1, end_event=due_date, user=self.user)
        task.save()

        # 'Not Important & Urgent' category (category 3)
        self.assertEqual(task.calculate_eisenhower_matrix_category(), 3)