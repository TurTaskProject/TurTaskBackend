from django.urls import path
from users.views import CustomUserCreate, CustomUserProfileUpdate, UserDataRetriveViewset

urlpatterns = [
    path('user/create/', CustomUserCreate.as_view(), name="create_user"),
    path('user/update/', CustomUserProfileUpdate.as_view(), name='update_user'),
    path('user/data/', UserDataRetriveViewset.as_view({'get': 'retrieve'}), name="get_user_data"),
]