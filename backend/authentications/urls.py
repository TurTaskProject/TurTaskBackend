from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from authentications.views import ObtainTokenPairWithCustomView, GreetingView, GoogleLogin, GoogleRetrieveUserInfo

urlpatterns = [
    path('token/obtain/', jwt_views.TokenObtainPairView.as_view(), name='token_create'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('token/custom_obtain/', ObtainTokenPairWithCustomView.as_view(), name='token_create_custom'),
    path('hello/', GreetingView.as_view(), name='hello_world'),
    path('dj-rest-auth/google/', GoogleLogin.as_view(), name="google_login"),
    path('auth/google/', GoogleRetrieveUserInfo.as_view()),
]