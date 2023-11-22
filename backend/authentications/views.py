"""This module defines API views for authentication, user creation, and a simple hello message."""

import json
import requests

from django.conf import settings
from django.contrib.auth.hashers import make_password

from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication


from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter

from dj_rest_auth.registration.views import SocialLoginView

from google_auth_oauthlib.flow import InstalledAppFlow

from authentications.access_token_cache import store_token
from authentications.serializers import MyTokenObtainPairSerializer
from users.managers import CustomAccountManager
from users.models import CustomUser


class CheckAccessTokenAndRefreshToken(APIView):
    permission_classes = (AllowAny,)
    JWT_authenticator = JWTAuthentication()

    def post(self, request, *args, **kwargs):
        access_token = request.data.get('access_token')
        refresh_token = request.data.get('refresh_token')
        # Check if the access token is valid
        if access_token:
            response = self.JWT_authenticator.authenticate(request)
            if response is not None:
                return Response({'status': 'true'}, status=status.HTTP_200_OK)

        # Check if the refresh token is valid
        if refresh_token:
            try:
                refresh = RefreshToken(refresh_token)
                access_token = str(refresh.access_token)
                return Response({'access_token': access_token}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'status': 'false'}, status=status.HTTP_401_UNAUTHORIZED)

        return Response({'status': 'false'}, status=status.HTTP_400_BAD_REQUEST)


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
    permission_classes = (AllowAny,)
    client_config = {"web":{"client_id": settings.GOOGLE_CLIENT_ID,
                            "project_id":"turtask","auth_uri": "https://accounts.google.com/o/oauth2/auth",
                            "token_uri": "https://oauth2.googleapis.com/token",
                            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                            "client_secret": settings.GOOGLE_CLIENT_SECRET,
                            }
                    }
    scopes = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/calendar.readonly',
    ]

    def post(self, request):
        code = request.data.get("code")
        payload = self.exchange_authorization_code(code=code)
        if 'error' in payload:
            return Response({'error': payload['error']})
        user_info = self.call_google_api(api_url='https://www.googleapis.com/oauth2/v2/userinfo?alt=json',
                                        access_token=payload['access_token'])
        payload['email'] = user_info['email']
        user = self.get_or_create_user(payload)
        token = RefreshToken.for_user(user)
        
        response = {
            'username': user.username,
            'access_token': str(token.access_token),
            'refresh_token': str(token),
        }
        
        return Response(response)

    def get(self, request):
        """Get authorization url."""
        flow = InstalledAppFlow.from_client_config(client_config=self.client_config,
                                                   scopes=self.scopes)
        flow.redirect_uri = 'http://localhost:5173/'
        authorization_url, state = flow.authorization_url(
            access_type='offline',
            # include_granted_scopes='true',
        )
        return Response({'url': authorization_url})

    def exchange_authorization_code(self, code):
        """Exchange authorization code for access, id, refresh token."""
        url = 'https://oauth2.googleapis.com/token'
        payload = {
            'code': code,
            'client_id': settings.GOOGLE_CLIENT_ID,
            'client_secret': settings.GOOGLE_CLIENT_SECRET,
            'redirect_uri': 'postmessage',
            'grant_type': 'authorization_code',
        }
        response = requests.post(url, data=payload)        
        return json.loads(response.text)

    def get_or_create_user(self, user_info):
        """Get or create a user based on email."""
        try:
            user = CustomUser.objects.get(email=user_info['email'])
            user.refresh_token = user_info['refresh_token']
            user.save()
        except CustomUser.DoesNotExist:
            user = CustomUser()
            user.username = user_info['email']
            user.password = make_password(CustomAccountManager().make_random_password())
            user.email = user_info['email']
            user.refresh_token = user_info['refresh_token']
            user.save()
        store_token(user.id, user_info['access_token'], 'access')
        store_token(user.id, user_info['id_token'], 'id')
        return user

    def call_google_api(self, api_url, access_token):
        """Call Google API with access token."""
        headers = {
            'Authorization': f'Bearer {access_token}'
        }

        response = requests.get(api_url, headers=headers)
        if response.status_code == 200:
            return response.json()
        raise Exception('Google API Error', response)