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
        request.data['board'] = request.data.get('board')  # Make sure 'board' is in request data
        board_user_id = ListBoard.objects.get(id=request.data['board']).board.request.user.id
        if request.user.id != board_user_id:
            return Response({"error": "Cannot create ListBoard for another user's board."}, status=status.HTTP_403_FORBIDDEN)
        return super().create(request, *args, **kwargs)
        
