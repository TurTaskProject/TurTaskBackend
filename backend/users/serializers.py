from rest_framework import serializers
from .models import CustomUser


class CustomUserSerializer(serializers.ModelSerializer):
    """
    Serializer for CustomUser model.
    """
    email = serializers.EmailField(required=True)
    username = serializers.CharField()
    password = serializers.CharField(min_length=8, write_only=True)

    class Meta:
        model = CustomUser
        fields = ('email', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        """
        Create a CustomUser instance with validated data, including password hashing.
        """
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


class UpdateProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user profile.
    """
    profile_pic = serializers.ImageField(required=False)
    first_name = serializers.CharField(max_length=255, required=False)
    about = serializers.CharField(required=False)

    class Meta:
        model = CustomUser
        fields = ('profile_pic', 'first_name', 'about')

    def update(self, instance, validated_data):
        """
        Update an existing user's profile.
        """
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance