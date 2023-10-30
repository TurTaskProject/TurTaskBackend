"""This module defines API views for authentication, user creation, and a simple hello message."""

import json
import requests

from django.contrib.auth.hashers import make_password

from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client

from dj_rest_auth.registration.views import SocialLoginView

from .serializers import MyTokenObtainPairSerializer, CustomUserSerializer
from .managers import CustomAccountManager
from .models import CustomUser


class ObtainTokenPairWithCustomView(APIView):
    """
    Custom Token Obtain Pair View.
    Allows users to obtain access and refresh tokens by providing credentials.
    """
    permission_classes = (AllowAny,)

    def post(self, request):
        """
        Issue access and refresh tokens in response to a valid login request.
        """
        serializer = MyTokenObtainPairSerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data
            return Response(token, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomUserCreate(APIView):
    """
    Custom User Creation View.
    Allows users to create new accounts.
    """
    permission_classes = (AllowAny,)

    def post(self, request):
        """
        Create a new user account based on the provided data.
        """
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GreetingView(APIView):
    """
    Hello World View.
    Returns a greeting and user information for authenticated users.
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        """
        Retrieve a greeting message and user information.
        """
        user = request.user
        user_info = {
            "username": user.username,
        }
        response_data = {
            "message": "Hello, world!",
            "user_info": user_info,
        }
        return Response(response_data, status=status.HTTP_200_OK)


class GoogleLogin(SocialLoginView):
    """
    Google Login View.
    Handles Google OAuth2 authentication.
    """
    # permission_classes = (AllowAny,)
    adapter_class = GoogleOAuth2Adapter
    # client_class = OAuth2Client
    # callback_url = 'http://localhost:8000/accounts/google/login/callback/'


class GoogleRetrieveUserInfo(APIView):
    """
    Retrieve user information from Google and create a user if not exists.
    """
    def post(self, request):
        access_token = request.data.get("token")

        user_info = self.get_google_user_info(access_token)

        if 'error' in user_info:
            error_message = 'Wrong Google token or the token has expired.'
            return Response({'message': error_message, 'error': user_info['error']})

        user = self.get_or_create_user(user_info)
        token = RefreshToken.for_user(user)
        
        response = {
            'username': user.username,
            'access_token': str(token.access_token),
            'refresh_token': str(token),
        }
        
        return Response(response)

    def get_google_user_info(self, access_token):
        url = 'https://www.googleapis.com/oauth2/v2/userinfo'
        payload = {'access_token': access_token}
        response = requests.get(url, params=payload)
        return json.loads(response.text)

    def get_or_create_user(self, user_info):
        try:
            user = CustomUser.objects.get(email=user_info['email'])
        except CustomUser.DoesNotExist:
            user = CustomUser()
            user.username = user_info['email']
            user.password = make_password(CustomAccountManager().make_random_password())
            user.email = user_info['email']
            user.save()
        return user