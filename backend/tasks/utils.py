from dateutil import rrule
from datetime import datetime

from googleapiclient.discovery import build

from authentications.access_token_cache import get_credential_from_cache_token


def get_service(request):
    """
    Get a service that communicates to a Google API.
    
    :param request: Http request object
    :return: A Resource object with methods for interacting with the calendar service
    """
    credentials = get_credential_from_cache_token(request.user.id)
    return build('calendar', 'v3', credentials=credentials)

def _determine_frequency(time_difference):
    if time_difference.days >= 365:
        return rrule.YEARLY
    elif time_difference.days >= 30:
        return rrule.MONTHLY
    elif time_difference.days >= 7:
        return rrule.WEEKLY
    elif time_difference.days >= 1:
        return rrule.DAILY
    elif time_difference.seconds >= 3600:
        return rrule.HOURLY
    elif time_difference.seconds >= 60:
        return rrule.MINUTELY
    else:
        return rrule.SECONDLY

def generate_recurrence_rule(datetime1: str, datetime2: str, original_start_time: str) -> str:
    """
    Generate recurrence rule from 
    difference between two datetime string.
    
    :param task1: A task object
    :param task2: A task object
    :return: A recurrence rule string according to ICAL format
    """
    start_time1 = datetime.fromisoformat(datetime1)
    start_time2 = datetime.fromisoformat(datetime2)

    time_difference = start_time2 - start_time1

    recurrence_rule = rrule.rrule(
        freq=_determine_frequency(time_difference),
        dtstart=datetime.fromisoformat(original_start_time),
        interval=time_difference.days if time_difference.days > 0 else 1,
    )

    return str(recurrence_rule)