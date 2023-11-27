"""This module defines API views for user creation"""

from rest_framework import status, viewsets, mixins
from rest_framework.permissions import AllowAny, IsAuthenticated

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser

from rest_framework_simplejwt.tokens import RefreshToken

from users.serializers import CustomUserSerializer, UpdateProfileSerializer
from users.models import CustomUser

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
                refresh = RefreshToken.for_user(user)
                return Response(data={'access_token': str(refresh.access_token), 'refresh_token': str(refresh),},
                                status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class CustomUserProfileUpdate(APIView):
    """
    Custom User Profile Update View.
    """
    parser_classes = (MultiPartParser,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        image_url = user.profile_pic.url
        username = user.username

        data = {
            'image_url': image_url,
            'username': username
        }

        return Response(data)

    def post(self, request):
        if not CustomUser.objects.filter(email=request.user.email).exists():
            return Response ({
                'error': 'User does not exist'
            }, status=status.HTTP_404_NOT_FOUND)
        serializer = UpdateProfileSerializer(request.user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class UserDataRetriveViewset(viewsets.GenericViewSet, mixins.RetrieveModelMixin):
    queryset = CustomUser.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = UpdateProfileSerializer

    def retrieve(self, request, *args, **kwargs):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
        
