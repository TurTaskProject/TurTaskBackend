from rest_framework import status
from rest_framework.test import APIClient
from django.urls import reverse

from users.models import CustomUser
from ..models import Todo


def create_test_user(email="testusertestuser@example.com",
                               username="testusertestuser",
                               password="testpassword",) -> CustomUser:
    """create predifined user without placeholder task for testing"""
    client = APIClient()
    response = client.post(reverse('create_user'), {'email': email,
                                                            'username': username,
                                                            'password': password})
    if response.status_code == status.HTTP_201_CREATED:
        user = CustomUser.objects.get(username='testusertestuser')
        user.todo_set.all().delete()
        return user
    return None


def create_task_json(user, **kwargs):
    """Create task JSON data to use with the API."""
    defaults = {
        "title": "Test Task",
        "type": "habit",
        "notes": "This is a test task created via the API.",
        "difficulty": 1,
        "challenge": False,
        "fromSystem": False,
        "creation_date": None,
        "last_update": None,
    }

    task_attributes = {**defaults, **kwargs}
    task_attributes["user"] = user

    return task_attributes


def create_test_task(user, **kwargs):
    """Create a test task and associate it with the given user."""
    defaults = {
        'title': "Test Task",
        'task_type': 'habit',
        'notes': "This is a test task created via the API.",
        'difficulty': 1,
        'attribute': 'str',
        'challenge': False,
        'fromSystem': False,
    }

    task_attributes = {**defaults, **kwargs}

    return Todo.objects.create(user=user, **task_attributes)