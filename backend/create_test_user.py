#!/usr/bin/env python
import os
import sys
import django

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from emph_app.models import ClientUser, Client, SIDSIsland

def create_test_user():
    # Create a test client first
    created = False
    try:
        client, created = Client.objects.get_or_create(
            name="Test Organization",
            defaults={
                'slug': 'test-org',
                'organization_type': 'NGO',
                'organization_name': 'Test Organization',
                'country': 'Jamaica',
            }
        )
    except Exception as e:
        # If there's a conflict, try to get the existing client
        print(f"Client creation error: {e}")
        try:
            client = Client.objects.get(slug='test-org')
            print(f"Using existing client: {client.name}")
        except Client.DoesNotExist:
            # Create with a different slug
            client = Client.objects.create(
                name="Test Organization",
                slug='test-org-2',
                organization_type='NGO',
                organization_name='Test Organization',
                country='Jamaica',
            )
            print(f"Created new client with different slug: {client.name}")
    
    if created:
        print(f"Created test client: {client.name}")
    
    # Create a test user
    try:
        user, created = ClientUser.objects.get_or_create(
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
        
        if created:
            user.set_password('password123')
            user.save()
            print(f"Created test user: {user.email}")
            print("Login credentials:")
            print("Email: test@example.com")
            print("Password: password123")
        else:
            print(f"Test user already exists: {user.email}")
            # Update password in case it was changed
            user.set_password('password123')
            user.save()
            print("Password reset to: password123")
    except Exception as e:
        print(f"Error creating user: {e}")
        # Try to get existing user
        try:
            user = ClientUser.objects.get(email='test@example.com')
            user.set_password('password123')
            user.save()
            print(f"Updated existing user: {user.email}")
            print("Password reset to: password123")
        except ClientUser.DoesNotExist:
            print("Could not create or find test user")
            return

if __name__ == '__main__':
    create_test_user() 