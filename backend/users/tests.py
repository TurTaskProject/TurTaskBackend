from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from users.models import CustomUser, UserStats
from boards.models import Board, ListBoard
from tasks.models import Todo

class SignalsTest(APITestCase):
    def setUp(self):
        response = self.client.post(reverse('create_user'), {'email': 'testusertestuser123@mail.com',
                                                             'username': 'testusertestuser123',
                                                             'password': '321testpassword123'})
        # force login If response is 201 OK
        if response.status_code == status.HTTP_201_CREATED:
            self.user = CustomUser.objects.get(username='testusertestuser123')
            self.client.force_login(self.user)

    def test_create_user_with_stas_default_boards_and_lists(self):
        # Stats check
        self.assertTrue(UserStats.objects.filter(user=self.user).exists())

        # check if user is created
        self.assertEqual(CustomUser.objects.count(), 1)
        user = CustomUser.objects.get(username='testusertestuser123')

        # Check for default board
        self.assertEqual(Board.objects.filter(user=self.user).count(), 1)

        # Check for default lists in board
        default_board = Board.objects.get(user=self.user)
        self.assertEqual(ListBoard.objects.filter(board=default_board).count(), 4)

    def test_create_user_with_placeholder_tasks(self):
        default_board = Board.objects.get(user=self.user)

        # Check if placeholder tasks are created for each ListBoard
        for list_board in ListBoard.objects.filter(board=default_board):
            placeholder_tasks_count = Todo.objects.filter(list_board=list_board).count()
            self.assertTrue(placeholder_tasks_count > 0)