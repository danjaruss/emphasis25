from django.contrib import admin
from .models import (
    Project, ProjectTimeline, ProjectMilestone,
    SDGGoal, FundingSource, ProjectFunding,
    ProjectObjective, SuccessMetric, ProjectDraft
)

class ProjectTimelineInline(admin.StackedInline):
    model = ProjectTimeline
    extra = 0

class ProjectMilestoneInline(admin.TabularInline):
    model = ProjectMilestone
    extra = 1

class ProjectObjectiveInline(admin.StackedInline):
    model = ProjectObjective
    extra = 1

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'client', 'project_type', 'priority', 'island', 'created_at')
    list_filter = ('client', 'priority', 'geographic_scope', 'sdgs')
    search_fields = ('name', 'description')
    inlines = [ProjectTimelineInline, ProjectMilestoneInline, ProjectObjectiveInline]
    filter_horizontal = ('sdgs',)

@admin.register(SDGGoal)
class SDGGoalAdmin(admin.ModelAdmin):
    list_display = ('number', 'title', 'color')
    search_fields = ('title',)

@admin.register(FundingSource)
class FundingSourceAdmin(admin.ModelAdmin):
    list_display = ('label',)

@admin.register(ProjectFunding)
class ProjectFundingAdmin(admin.ModelAdmin):
    list_display = ('project', 'source')

@admin.register(ProjectMilestone)
class ProjectMilestoneAdmin(admin.ModelAdmin):
    list_display = ('project', 'title', 'due_date', 'completed')

@admin.register(ProjectObjective)
class ProjectObjectiveAdmin(admin.ModelAdmin):
    list_display = ('project', 'text')

@admin.register(SuccessMetric)
class SuccessMetricAdmin(admin.ModelAdmin):
    list_display = ('objective', 'text')

@admin.register(ProjectDraft)
class ProjectDraftAdmin(admin.ModelAdmin):
    list_display = ('project', 'current_step', 'is_finalized', 'last_saved')

