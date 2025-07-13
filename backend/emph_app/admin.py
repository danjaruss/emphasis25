from django.contrib import admin
from .models import Client, ClientUser, SIDSIsland

@admin.register(SIDSIsland)
class SIDSIslandAdmin(admin.ModelAdmin):
    list_display = ('name', 'region', 'iso_code')
    search_fields = ('name', 'region')

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name',)
    filter_horizontal = ('sids',)

@admin.register(ClientUser)
class ClientUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'client', 'role', 'is_superuser')
    list_filter = ('client', 'role', 'is_superuser')
    search_fields = ('username', 'email')

