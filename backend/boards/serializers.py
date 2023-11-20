from rest_framework import serializers

from boards.models import Board, ListBoard

class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = '__all__'

class ListBoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListBoard
        fields = '__all__'
