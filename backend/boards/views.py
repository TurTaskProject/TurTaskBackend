from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status

from boards.models import Board, ListBoard
from boards.serializers import BoardSerializer, ListBoardSerializer

class BoardViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    http_method_names = ['get']

    def get_queryset(self):
        queryset = Board.objects.filter(user_id=self.request.user.id)
        return queryset


class ListBoardViewSet(viewsets.ModelViewSet):
    serializer_class = ListBoardSerializer

    def get_queryset(self):
        queryset = ListBoard.objects.filter(board__user_id=self.request.user.id)
        return queryset

    def create(self, request, *args, **kwargs):
        board_id = request.data.get('board')
        board = Board.objects.get(id=board_id)
        if request.user.id != board.user.id:
            return Response({"error": "Cannot create ListBoard for another user's board."}, status=status.HTTP_403_FORBIDDEN)
        return super().create(request, *args, **kwargs)
        
