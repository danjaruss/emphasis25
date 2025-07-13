from django.db import models
from projects.models import Project

class StakeholderCategory(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class ProjectStakeholder(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="stakeholders")
    category = models.ForeignKey(StakeholderCategory, on_delete=models.CASCADE)

