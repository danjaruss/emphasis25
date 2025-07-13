from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Client, SIDSIsland

class SIDSIslandSerializer(serializers.ModelSerializer):
    class Meta:
        model = SIDSIsland
        fields = ['id', 'name', 'region', 'iso_code']

class ClientSerializer(serializers.ModelSerializer):
    sids = SIDSIslandSerializer(many=True, read_only=True)
    sids_ids = serializers.PrimaryKeyRelatedField(
        queryset=SIDSIsland.objects.all(),
        write_only=True,
        many=True,
        required=False,
        source='sids'
    )

    class Meta:
        model = Client
        fields = [
            'id', 'name', 'slug', 'sids', 'sids_ids',
            'organization_type', 'organization_name', 'country', 'phone_number', 'website'
        ]
        read_only_fields = ['slug']

    def create(self, validated_data):
        sids = validated_data.pop('sids', [])
        client = Client.objects.create(**validated_data)
        if sids:
            client.sids.set(sids)
        return client

    def update(self, instance, validated_data):
        sids = validated_data.pop('sids', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if sids is not None:
            instance.sids.set(sids)
        return instance

class ClientUserSerializer(serializers.ModelSerializer):
    client = ClientSerializer(read_only=True)
    client_id = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
        source='client'
    )
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = get_user_model()
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'client', 'client_id', 'is_active', 'date_joined',
            'password',
            'job_title', 'focus_areas', 'project_experience', 'motivation', 'subscribe_to_updates'
        ]
        read_only_fields = ['date_joined']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = super().create(validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user 