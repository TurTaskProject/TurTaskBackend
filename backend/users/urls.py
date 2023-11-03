from django.urls import path
from users.views import CustomUserCreate

urlpatterns = [
    path('user/create/', CustomUserCreate.as_view(), name="create_user"),
]