from django.urls import path, include
from rest_framework.routers import DefaultRouter
from boards.views import BoardViewSet, ListBoardViewSet

router = DefaultRouter()
router.register(r'boards', BoardViewSet, basename='board')
router.register(r'lists', ListBoardViewSet, basename='listboard')

urlpatterns = [
    path('', include(router.urls)),
]