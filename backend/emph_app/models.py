from django.contrib.auth.models import AbstractUser
from django.db import models

class SIDSIsland(models.Model):
    name = models.CharField(max_length=255)
    region = models.CharField(max_length=100, choices=[
        ('Caribbean', 'Caribbean'),
        ('Pacific', 'Pacific'),
        ('AIMS', 'Atlantic, Indian Ocean, Mediterranean, South China Sea')
    ])
    iso_code = models.CharField(max_length=10, blank=True)

    def __str__(self):
        return self.name

class Client(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    sids = models.ManyToManyField(SIDSIsland, related_name='clients')
    # Extra fields for registration
    organization_type = models.CharField(max_length=100, blank=True, null=True)
    organization_name = models.CharField(max_length=255, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    phone_number = models.CharField(max_length=50, blank=True, null=True)
    website = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name

class ClientUser(AbstractUser):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, null=True, blank=True)
    role = models.CharField(max_length=50, choices=[
        ('ADMIN', 'Admin'),
        ('AGENT', 'Agent'),
        ('CLIENT', 'Client')
    ])
    # Extra fields for registration
    job_title = models.CharField(max_length=255, blank=True, null=True)
    focus_areas = models.JSONField(blank=True, null=True)
    project_experience = models.TextField(blank=True, null=True)
    motivation = models.TextField(blank=True, null=True)
    subscribe_to_updates = models.BooleanField(default=True)

    # Override username field to use email
    username = models.CharField(
        max_length=150,
        unique=True,
        help_text='Required. 150 characters or fewer.',
        validators=[AbstractUser.username_validator],
        error_messages={
            'unique': "A user with that username already exists.",
        },
    )
    email = models.EmailField(
        unique=True,
        error_messages={
            'unique': "A user with that email already exists.",
        }
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

