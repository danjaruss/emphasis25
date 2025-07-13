from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'islands', views.SIDSIslandViewSet)
router.register(r'clients', views.ClientViewSet)
router.register(r'users', views.ClientUserViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 