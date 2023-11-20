import random
import math

from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

from .managers import CustomAccountManager


class CustomUser(AbstractBaseUser, PermissionsMixin):
    """
    User model where email is the unique identifier for authentication.
    """
    email = models.EmailField(_('email address'), unique=True)
    username = models.CharField(max_length=150, unique=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    start_date = models.DateTimeField(default=timezone.now)
    about = models.TextField(_('about'), max_length=500, blank=True)
    profile_pic = models.ImageField(upload_to='profile_pics', null=True, blank=True, default='profile_pics/default.png')
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    # Custom manager
    objects = CustomAccountManager()

    # Google API
    refresh_token = models.CharField(max_length=255, blank=True, null=True)

    # Fields for authentication
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name']

    def __str__(self):
        # String representation of the user
        return self.username

def random_luck():
    return random.randint(1, 50)

class UserStats(models.Model):
    """
    Represents User Profiles and Attributes.
    Fields:
    - health: health points of the user.
    - gold: gold points of the user.
    - experience: experience points of the user.
    """
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    health = models.IntegerField(default=100)
    gold = models.FloatField(default=0.0)
    experience = models.FloatField(default=0)
    
    @property
    def level(self):
        return (math.pow(self.experience, 2) // 225) + 1