from googleapiclient.discovery import build

from users.access_token_cache import get_credential_from_cache_token


def get_service(request):
    credentials = get_credential_from_cache_token(request.user.id)
    return build('calendar', 'v3', credentials=credentials)