from django.db import models
from projects.models import Project

class RiskFactor(models.Model):
    label = models.CharField(max_length=100)

    def __str__(self):
        return self.label

class ProjectRisk(models.Model):
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name="risk_assessment")
    overall_level = models.CharField(max_length=50, choices=[
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High')
    ])
    risk_factors = models.ManyToManyField(RiskFactor)

