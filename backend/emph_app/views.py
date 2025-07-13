from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Client, SIDSIsland
from .serializers import ClientSerializer, ClientUserSerializer, SIDSIslandSerializer
from rest_framework import serializers

# Create your views here.

class SIDSIslandViewSet(viewsets.ModelViewSet):
    queryset = SIDSIsland.objects.all()
    serializer_class = SIDSIslandSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = SIDSIsland.objects.all()
        region = self.request.query_params.get('region', None)
        if region:
            queryset = queryset.filter(region=region)
        return queryset

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Client.objects.none()
        if user.role == 'ADMIN':
            return Client.objects.filter(id=user.client.id)
        return Client.objects.none()

    def perform_create(self, serializer):
        # Generate a unique slug from the organization name
        name = serializer.validated_data.get('name', '')
        if not name:
            name = serializer.validated_data.get('organization_name', '')
        if name:
            slug = name.lower().replace(' ', '-')
            # Ensure slug is unique
            base_slug = slug
            counter = 1
            while Client.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            serializer.save(slug=slug)
        else:
            serializer.save()

    @action(detail=True, methods=['get'])
    def users(self, request, pk=None):
        client = self.get_object()
        users = get_user_model().objects.filter(client=client)
        serializer = ClientUserSerializer(users, many=True)
        return Response(serializer.data)

class ClientUserViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = ClientUserSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return get_user_model().objects.none()
        if user.role == 'ADMIN':
            return get_user_model().objects.filter(client=user.client)
        return get_user_model().objects.filter(id=user.id)

    def perform_create(self, serializer):
        # If creating a new user, we need to handle the client assignment
        if not self.request.user.is_authenticated:
            # For registration, we expect client_id in the request data
            client_id = self.request.data.get('client')
            if not client_id:
                raise serializers.ValidationError({'client': 'This field is required for registration'})
            try:
                client = Client.objects.get(id=client_id)
                serializer.save(client=client)
            except Client.DoesNotExist:
                raise serializers.ValidationError({'client': 'Invalid client ID'})
        else:
            # For authenticated users creating new users
            serializer.save(client=self.request.user.client)

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def change_password(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not user.check_password(old_password):
            return Response(
                {'error': 'Invalid old password'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()
        return Response({'status': 'password changed'})
