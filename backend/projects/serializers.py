from emph_app.models import SIDSIsland
from rest_framework import serializers
from .models import (
    Project, ProjectTimeline, ProjectMilestone,
    SDGGoal, SDGTarget, FundingSource, ProjectFunding,
    ProjectObjective, SuccessMetric, ProjectDraft
)
from emph_app.models import Client
from emph_app.serializers import ClientSerializer, SIDSIslandSerializer, ClientUserSerializer

class SDGGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = SDGGoal
        fields = ['id', 'number', 'title', 'shortened_title', 'color', 'description']

class SDGTargetSerializer(serializers.ModelSerializer):
    goal = SDGGoalSerializer(read_only=True)
    
    class Meta:
        model = SDGTarget
        fields = ['id', 'goal', 'target_number', 'title', 'description']

class FundingSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = FundingSource
        fields = ['id', 'label']

class ProjectTimelineSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectTimeline
        fields = ['id', 'start_date', 'end_date', 'total_budget']

class ProjectMilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMilestone
        fields = ['id', 'title', 'description', 'due_date', 'completed']

class SuccessMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = SuccessMetric
        fields = ['id', 'text']

class ProjectObjectiveSerializer(serializers.ModelSerializer):
    metrics = SuccessMetricSerializer(many=True, read_only=True)

    class Meta:
        model = ProjectObjective
        fields = ['id', 'text', 'metrics']

class ProjectFundingSerializer(serializers.ModelSerializer):
    source = FundingSourceSerializer(read_only=True)
    source_id = serializers.PrimaryKeyRelatedField(
        queryset=FundingSource.objects.all(),
        write_only=True,
        source='source'
    )

    class Meta:
        model = ProjectFunding
        fields = ['id', 'source', 'source_id']

class ProjectDraftSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectDraft
        fields = ['id', 'current_step', 'is_finalized', 'last_saved']

class ProjectSerializer(serializers.ModelSerializer):
    client = ClientSerializer(read_only=True)
    client_id = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all(),
        write_only=True,
        source='client'
    )
    island = SIDSIslandSerializer(read_only=True)
    island_id = serializers.PrimaryKeyRelatedField(
        queryset=SIDSIsland.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
        source='island'
    )
    created_by = ClientUserSerializer(read_only=True)
    sdgs = SDGGoalSerializer(many=True, read_only=True)
    sdg_ids = serializers.PrimaryKeyRelatedField(
        queryset=SDGGoal.objects.all(),
        write_only=True,
        many=True,
        required=False,
        source='sdgs'
    )
    sdg_targets = SDGTargetSerializer(many=True, read_only=True)
    sdg_target_ids = serializers.PrimaryKeyRelatedField(
        queryset=SDGTarget.objects.all(),
        write_only=True,
        many=True,
        required=False,
        source='sdg_targets'
    )
    timeline = ProjectTimelineSerializer(read_only=True)
    milestones = ProjectMilestoneSerializer(many=True, read_only=True)
    objectives = ProjectObjectiveSerializer(many=True, read_only=True)
    funding_sources = ProjectFundingSerializer(many=True, read_only=True)
    draft = ProjectDraftSerializer(read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'project_type', 'priority',
            'location', 'geographic_scope', 'client', 'client_id',
            'island', 'island_id', 'sdgs', 'sdg_ids', 'sdg_targets', 'sdg_target_ids', 'created_by',
            'created_at', 'timeline', 'milestones', 'objectives',
            'funding_sources', 'draft'
        ]
        read_only_fields = ['created_by', 'created_at']

    def create(self, validated_data):
        # Extract related data
        sdgs = validated_data.pop('sdgs', [])
        sdg_targets = validated_data.pop('sdg_targets', [])
        
        # Create the project
        project = Project.objects.create(**validated_data)
        
        # Add SDGs
        if sdgs:
            project.sdgs.set(sdgs)
        
        # Add SDG targets
        if sdg_targets:
            project.sdg_targets.set(sdg_targets)
        
        return project

    def update(self, instance, validated_data):
        # Extract related data
        sdgs = validated_data.pop('sdgs', None)
        sdg_targets = validated_data.pop('sdg_targets', None)
        
        # Update the project
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update SDGs if provided
        if sdgs is not None:
            instance.sdgs.set(sdgs)
        
        # Update SDG targets if provided
        if sdg_targets is not None:
            instance.sdg_targets.set(sdg_targets)
        
        return instance
