from datetime import datetime
from zoneinfo import ZoneInfo

from django.test import TestCase
from django.utils import timezone

from tasks.tests.utils import create_test_user, login_user
from tasks.serializers import TaskUpdateSerializer
from tasks.models import Task

class TaskUpdateSerializerTest(TestCase):
    def setUp(self):
        self.user = create_test_user()
        self.current_time = '2020-08-01T00:00:00Z'
        self.end_time = '2020-08-01T00:00:00Z'

    def test_serializer_create(self):
        data = {
            'id': '32141cwaNcapufh8jq2conw',
            'summary': 'Updated Task',
            'description': 'Updated description',
            'created': self.current_time,
            'updated': self.end_time,
            'start_datetime' : self.current_time,
            'end_datetie': self.end_time,
        }

        serializer = TaskUpdateSerializer(data=data, user=self.user)
        self.assertTrue(serializer.is_valid())
        serializer.is_valid()
        task = serializer.save()
        self.assertIsInstance(task, Task)

    def test_serializer_update(self):
        task = Task.objects.create(title='Original Task', notes='Original description', user=self.user)

        data = {
            'id': '32141cwaNcapufh8jq2conw',
            'summary': 'Updated Task',
            'description': 'Updated description',
            'created': self.current_time,
            'updated': self.end_time,
            'start_datetime' : self.current_time,
            'end_datetie': self.end_time,
        }

        serializer = TaskUpdateSerializer(instance=task, data=data)
        self.assertTrue(serializer.is_valid())
        updated_task = serializer.save()

        self.assertEqual(updated_task.title, 'Updated Task')
        self.assertEqual(updated_task.notes, 'Updated description')
        self.assertEqual(updated_task.start_event,
                         datetime.strptime(self.current_time,
                                           '%Y-%m-%dT%H:%M:%SZ')
                                           .replace(tzinfo=ZoneInfo(key='UTC')))