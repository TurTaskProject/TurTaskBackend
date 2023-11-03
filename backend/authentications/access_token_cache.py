from django.core.cache import cache
from django.conf import settings

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

from users.models import CustomUser


def store_token(user_id, token, token_type):
    cache_key = f"user_{token_type}_token:{user_id}"
    cache.set(cache_key, token, timeout=3600)


def get_credential_from_cache_token(user_id):
    access_token = cache.get(f"user_access_token:{user_id}")
    id_token = cache.get(f"user_id_token:{user_id}")
    refresh_token = CustomUser.objects.get(id=user_id).refresh_token
    scopes = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/calendar.readonly',
    ]
    # credentials = Credentials.from_authorized_user_info(
    # {
    #     'access_token': access_token,
    #     'token_uri': 'https://oauth2.googleapis.com/token',
    #     'refresh_token': refresh_token,
    #     'client_id': settings.GOOGLE_CLIENT_ID,
    #     'client_secret': settings.GOOGLE_CLIENT_SECRET,
    #     'id_token': id_token,
    # }
    
    credentials = Credentials(token=access_token,
                              refresh_token=refresh_token,
                              token_uri='https://oauth2.googleapis.com/token',
                              client_id=settings.GOOGLE_CLIENT_ID,
                              client_secret=settings.GOOGLE_CLIENT_SECRET,
                              scopes=scopes,
                              id_token=id_token
                              )

    # If can refresh, refresh
    if credentials.expired and credentials.refresh_token:
        credentials.refresh(Request())
        store_token(user_id, credentials.token, 'access')
        store_token(user_id, credentials.id_token, 'id')
    
    return credentials