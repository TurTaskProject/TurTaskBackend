from rest_framework.test import APIClient

from users.models import CustomUser
from ..models import Todo


def create_test_user(email="testusertestuser@example.com", username="testusertestuser",
               first_name="Test", password="testpassword",):
    """create predifined user for testing"""
    return CustomUser.objects.create_user(
        email=email,
        username=username,
        first_name=first_name,
        password=password,
    )


def login_user(user):
    """Login a user to API client."""

    client = APIClient()
    client.force_authenticate(user=user)
    return client


def create_task_json(user, **kwargs):
    """Create task JSON data to use with the API."""
    defaults = {
        "title": "Test Task",
        "type": "habit",
        "notes": "This is a test task created via the API.",
        "exp": 10,
        "priority": 1.5,
        "difficulty": 1,
        "attribute": "str",
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
        'exp': 10,
        'priority': 1.5,
        'difficulty': 1,
        'attribute': 'str',
        'challenge': False,
        'fromSystem': False,
    }

    task_attributes = {**defaults, **kwargs}

    return Todo.objects.create(user=user, **task_attributes)