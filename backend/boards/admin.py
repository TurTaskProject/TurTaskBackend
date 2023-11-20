from django.contrib import admin
from .models import Board, ListBoard

@admin.register(Board)
class BoardAdmin(admin.ModelAdmin):
    list_display = ['name', 'user']

@admin.register(ListBoard)
class ListBoardAdmin(admin.ModelAdmin):
    list_display = ['name', 'position', 'board']
    list_filter = ['board', 'position']