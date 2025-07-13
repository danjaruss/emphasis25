from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import (
    Project, ProjectTimeline, ProjectMilestone,
    SDGGoal, SDGTarget, FundingSource, ProjectFunding,
    ProjectObjective, SuccessMetric, ProjectDraft
)
from .serializers import (
    ProjectSerializer, ProjectTimelineSerializer, ProjectMilestoneSerializer,
    SDGGoalSerializer, SDGTargetSerializer, FundingSourceSerializer, ProjectFundingSerializer,
    ProjectObjectiveSerializer, SuccessMetricSerializer, ProjectDraftSerializer
)
from django.utils import timezone

# Create your views here.

class SDGGoalViewSet(viewsets.ModelViewSet):
    queryset = SDGGoal.objects.all()
    serializer_class = SDGGoalSerializer
    permission_classes = [permissions.IsAuthenticated]

class SDGTargetViewSet(viewsets.ModelViewSet):
    queryset = SDGTarget.objects.all()
    serializer_class = SDGTargetSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def by_goal(self, request):
        goal_id = request.query_params.get('goal_id')
        if goal_id:
            targets = SDGTarget.objects.filter(goal_id=goal_id)
            serializer = self.get_serializer(targets, many=True)
            return Response(serializer.data)
        return Response({'error': 'goal_id parameter is required'}, status=400)

class FundingSourceViewSet(viewsets.ModelViewSet):
    queryset = FundingSource.objects.all()
    serializer_class = FundingSourceSerializer
    permission_classes = [permissions.IsAuthenticated]

class ProjectTimelineViewSet(viewsets.ModelViewSet):
    queryset = ProjectTimeline.objects.all()
    serializer_class = ProjectTimelineSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ProjectTimeline.objects.filter(project__client=self.request.user.client)

class ProjectMilestoneViewSet(viewsets.ModelViewSet):
    queryset = ProjectMilestone.objects.all()
    serializer_class = ProjectMilestoneSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ProjectMilestone.objects.filter(project__client=self.request.user.client).order_by('due_date')

class ProjectObjectiveViewSet(viewsets.ModelViewSet):
    queryset = ProjectObjective.objects.all()
    serializer_class = ProjectObjectiveSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ProjectObjective.objects.filter(project__client=self.request.user.client).order_by('created_at')

class SuccessMetricViewSet(viewsets.ModelViewSet):
    queryset = SuccessMetric.objects.all()
    serializer_class = SuccessMetricSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SuccessMetric.objects.filter(objective__project__client=self.request.user.client)

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Allow all authenticated users to see projects for their client
        return Project.objects.filter(client=user.client).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def create(self, request, *args, **kwargs):
        # Allow project creation for all authenticated users
        return super().create(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def add_milestone(self, request, pk=None):
        project = self.get_object()
        serializer = ProjectMilestoneSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(project=project)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def add_objective(self, request, pk=None):
        project = self.get_object()
        serializer = ProjectObjectiveSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(project=project)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def add_funding_source(self, request, pk=None):
        project = self.get_object()
        serializer = ProjectFundingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(project=project)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def update_timeline(self, request, pk=None):
        project = self.get_object()
        timeline, created = ProjectTimeline.objects.get_or_create(project=project)
        serializer = ProjectTimelineSerializer(timeline, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProjectDraftViewSet(viewsets.ModelViewSet):
    queryset = ProjectDraft.objects.all()
    serializer_class = ProjectDraftSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ProjectDraft.objects.filter(project__client=self.request.user.client)

    @action(detail=True, methods=['post'])
    def finalize(self, request, pk=None):
        draft = self.get_object()
        draft.is_finalized = True
        draft.save()
        return Response({'status': 'project finalized'})

class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Project.objects.none()

    def list(self, request):
        user = request.user
        # Get projects for the user's client
        projects = Project.objects.filter(client=user.client)
        
        # Calculate project stats
        total_projects = projects.count()
        
        # Count active and completed projects (only those with timelines)
        active_projects = 0
        completed_projects = 0
        for project in projects:
            try:
                if hasattr(project, 'timeline') and project.timeline:
                    if project.timeline.end_date > timezone.now().date():
                        active_projects += 1
                    else:
                        completed_projects += 1
            except project.timeline.RelatedObjectDoesNotExist:
                # Project doesn't have a timeline, count as active
                active_projects += 1
        
        on_hold_projects = projects.filter(priority='LOW').count()

        # Get budget data
        budget_data = []
        for project in projects:
            try:
                if hasattr(project, 'timeline') and project.timeline and project.timeline.total_budget:
                    budget_data.append({
                        'month': project.created_at.strftime('%b'),
                        'planned': project.timeline.total_budget,
                        'actual': sum(source.amount for source in project.funding_sources.all())
                    })
            except project.timeline.RelatedObjectDoesNotExist:
                # Project doesn't have a timeline, skip it
                continue

        # Get SDG distribution
        sdg_distribution = []
        for project in projects:
            for sdg in project.sdgs.all():
                existing = next((item for item in sdg_distribution if item['name'] == sdg.title), None)
                if existing:
                    existing['value'] += 1
                else:
                    sdg_distribution.append({
                        'name': sdg.title,
                        'value': 1,
                        'color': sdg.color
                    })

        # Get recent activity
        recent_activity = []
        milestones = ProjectMilestone.objects.filter(
            project__in=projects,
            completed=False
        ).order_by('-due_date')[:4]
        
        for milestone in milestones:
            recent_activity.append({
                'id': milestone.id,
                'type': 'milestone',
                'message': milestone.title,
                'project': milestone.project.name,
                'time': milestone.due_date.strftime('%Y-%m-%d'),
                'status': 'completed' if milestone.completed else 'pending'
            })

        # Get upcoming milestones
        upcoming_milestones = []
        future_milestones = ProjectMilestone.objects.filter(
            project__in=projects,
            completed=False,
            due_date__gt=timezone.now()
        ).order_by('due_date')[:3]
        
        for milestone in future_milestones:
            upcoming_milestones.append({
                'id': milestone.id,
                'title': milestone.title,
                'project': milestone.project.name,
                'dueDate': milestone.due_date.strftime('%Y-%m-%d'),
                'status': 'on-track',
                'progress': 0  # TODO: Calculate progress based on objectives
            })

        return Response({
            'projectStats': {
                'total': total_projects,
                'active': active_projects,
                'completed': completed_projects,
                'onHold': on_hold_projects
            },
            'budgetData': budget_data,
            'sdgDistribution': sdg_distribution,
            'recentActivity': recent_activity,
            'upcomingMilestones': upcoming_milestones
        })
