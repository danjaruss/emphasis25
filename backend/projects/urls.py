from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'sdgs', views.SDGGoalViewSet)
router.register(r'sdg-targets', views.SDGTargetViewSet)
router.register(r'funding-sources', views.FundingSourceViewSet)
router.register(r'timelines', views.ProjectTimelineViewSet)
router.register(r'milestones', views.ProjectMilestoneViewSet)
router.register(r'objectives', views.ProjectObjectiveViewSet)
router.register(r'metrics', views.SuccessMetricViewSet)
router.register(r'projects', views.ProjectViewSet, basename='project')
router.register(r'drafts', views.ProjectDraftViewSet)
router.register(r'dashboard', views.DashboardViewSet, basename='dashboard')

urlpatterns = [
    path('', include(router.urls)),
]
