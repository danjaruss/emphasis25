from django.contrib import admin
from .models import StakeholderCategory, ProjectStakeholder

@admin.register(StakeholderCategory)
class StakeholderCategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(ProjectStakeholder)
class ProjectStakeholderAdmin(admin.ModelAdmin):
    list_display = ('project', 'category')
    list_filter = ('category', 'project')

