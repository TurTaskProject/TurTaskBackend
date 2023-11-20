from django.contrib import admin
from .models import Board, ListBoard, KanbanTaskOrder

@admin.register(Board)
class BoardAdmin(admin.ModelAdmin):
    list_display = ['name', 'user']

@admin.register(ListBoard)
class ListBoardAdmin(admin.ModelAdmin):
    list_display = ['name', 'position', 'board']
    list_filter = ['board', 'position']


@admin.register(KanbanTaskOrder)
class KanbanTaskOrderAdmin(admin.ModelAdmin):
    list_display = ['list_board', 'todo_order']
    list_filter = ['list_board']