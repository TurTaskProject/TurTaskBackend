from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from authentications.views import ObtainTokenPairWithCustomView, GoogleRetrieveUserInfo, CheckAccessTokenAndRefreshToken

urlpatterns = [
    path('token/obtain/', jwt_views.TokenObtainPairView.as_view(), name='token_create'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('token/custom_obtain/', ObtainTokenPairWithCustomView.as_view(), name='token_create_custom'),
    path('auth/google/', GoogleRetrieveUserInfo.as_view()),
    path('auth/status/', CheckAccessTokenAndRefreshToken.as_view(), name='check_token_status')
]