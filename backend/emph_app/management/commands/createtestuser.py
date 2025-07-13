from django.core.management.base import BaseCommand
from emph_app.models import Client, ClientUser


class Command(BaseCommand):
    help = 'Creates a test user for development'

    def handle(self, *args, **options):
        # Create or get a test client
        client, client_created = Client.objects.get_or_create(
            slug='test-org',
            defaults={
                'name': 'Test Organization',
                'organization_type': 'NGO',
                'organization_name': 'Test Organization',
                'country': 'Jamaica',
            }
        )
        
        if client_created:
            self.stdout.write(
                self.style.SUCCESS(f'Created test client: {client.name}')
            )
        else:
            self.stdout.write(
                self.style.WARNING(f'Using existing client: {client.name}')
            )

        # Create or get the test user
        user, user_created = ClientUser.objects.get_or_create(
            email='test@example.com',
            defaults={
                'username': 'testuser',
                'first_name': 'Test',
                'last_name': 'User',
                'client': client,
                'role': 'ADMIN',
                'is_active': True,
            }
        )
        
        # Always set the password
        user.set_password('password123')
        user.save()
        
        if user_created:
            self.stdout.write(
                self.style.SUCCESS(f'Created test user: {user.email}')
            )
        else:
            self.stdout.write(
                self.style.WARNING(f'Updated existing user: {user.email}')
            )
        
        self.stdout.write(
            self.style.SUCCESS('Login credentials:')
        )
        self.stdout.write(
            self.style.SUCCESS('Email: test@example.com')
        )
        self.stdout.write(
            self.style.SUCCESS('Password: password123')
        ) 