from datetime import datetime
from zoneinfo import ZoneInfo

from rest_framework.test import APITestCase

from django.utils import timezone

from tasks.tests.utils import create_test_user
from tasks.serializers import TodoUpdateSerializer
from tasks.models import Todo
from boards.models import Board

class TaskUpdateSerializerTest(APITestCase):
    def setUp(self):
        self.user = create_test_user()
        self.client.force_authenticate(user=self.user)
        self.current_time = '2020-08-01T00:00:00Z'
        self.end_time = '2020-08-01T00:00:00Z'
        self.list_board = Board.objects.get(user=self.user).listboard_set.first()

    def test_serializer_create(self):
        data = {
            'id': '32141cwaNcapufh8jq2conw',
            'summary': 'Updated Task',
            'description': 'Updated description',
            'created': self.current_time,
            'updated': self.end_time,
            'start_datetime' : self.current_time,
            'end_datetie': self.end_time,
            'list_board': self.list_board.id,
        }

        serializer = TodoUpdateSerializer(data=data, user=self.user)
        self.assertTrue(serializer.is_valid())
        serializer.is_valid()
        task = serializer.save()
        self.assertIsInstance(task, Todo)

    def test_serializer_update(self):
        task = Todo.objects.create(title='Original Task', notes='Original description', user=self.user, list_board=self.list_board)

        data = {
            'id': '32141cwaNcapufh8jq2conw',
            'summary': 'Updated Task',
            'description': 'Updated description',
            'created': self.current_time,
            'updated': self.end_time,
            'start_datetime' : self.current_time,
            'end_datetie': self.end_time,
            'list_board': self.list_board.id,
        }

        serializer = TodoUpdateSerializer(instance=task, data=data)
        self.assertTrue(serializer.is_valid())
        updated_task = serializer.save()

        self.assertEqual(updated_task.title, 'Updated Task')
        self.assertEqual(updated_task.notes, 'Updated description')
        self.assertEqual(updated_task.start_event,
                         datetime.strptime(self.current_time,
                                           '%Y-%m-%dT%H:%M:%SZ')
                                           .replace(tzinfo=ZoneInfo(key='UTC')))