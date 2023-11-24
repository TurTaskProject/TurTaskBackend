from rest_framework import serializers
from .models import UserStats

class UserStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStats
        fields = ['health', 'gold', 'experience', 'strength', 'intelligence', 'endurance', 'perception', 'luck', 'level']