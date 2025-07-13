from django.db import models
from emph_app.models import Client, ClientUser, SIDSIsland

class SDGGoal(models.Model):
    number = models.PositiveIntegerField(unique=True)
    title = models.CharField(max_length=255)
    shortened_title = models.CharField(max_length=100, blank=True)
    color = models.CharField(max_length=20)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.number}. {self.title}"

class SDGTarget(models.Model):
    goal = models.ForeignKey(SDGGoal, on_delete=models.CASCADE, related_name='targets')
    target_number = models.CharField(max_length=10)  # e.g., "1.1", "1.2"
    title = models.CharField(max_length=500)
    description = models.TextField()
    
    class Meta:
        unique_together = ['goal', 'target_number']
        ordering = ['goal__number', 'target_number']

    def __str__(self):
        return f"{self.goal.number}.{self.target_number} - {self.title}"

class Project(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()
    project_type = models.CharField(max_length=100)
    priority = models.CharField(max_length=50)
    location = models.CharField(max_length=255)
    geographic_scope = models.CharField(max_length=100)
    island = models.ForeignKey(SIDSIsland, on_delete=models.SET_NULL, null=True)

    sdgs = models.ManyToManyField(SDGGoal)
    sdg_targets = models.ManyToManyField(SDGTarget, blank=True)
    created_by = models.ForeignKey(ClientUser, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class ProjectTimeline(models.Model):
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name="timeline")
    start_date = models.DateField()
    end_date = models.DateField()
    total_budget = models.DecimalField(max_digits=15, decimal_places=2)

class FundingSource(models.Model):
    label = models.CharField(max_length=100)

    def __str__(self):
        return self.label

class ProjectFunding(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="funding_sources")
    source = models.ForeignKey(FundingSource, on_delete=models.CASCADE)

class ProjectMilestone(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="milestones")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    due_date = models.DateField()
    completed = models.BooleanField(default=False)

class ProjectObjective(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="objectives")
    text = models.TextField()

class SuccessMetric(models.Model):
    objective = models.ForeignKey(ProjectObjective, on_delete=models.CASCADE, related_name="metrics")
    text = models.TextField()

class ProjectDraft(models.Model):
    project = models.OneToOneField(Project, on_delete=models.CASCADE)
    current_step = models.IntegerField(default=1)
    is_finalized = models.BooleanField(default=False)
    last_saved = models.DateTimeField(auto_now=True)

class SDGProgressReport(models.Model):
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('on_track', 'On Track'),
        ('at_risk', 'At Risk'),
        ('completed', 'Completed'),
        ('behind_schedule', 'Behind Schedule'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='sdg_progress')
    target = models.ForeignKey(SDGTarget, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    progress_percentage = models.PositiveIntegerField(default=0, help_text="Progress percentage (0-100)")
    description = models.TextField(blank=True, help_text="Description of progress made")
    challenges = models.TextField(blank=True, help_text="Challenges encountered")
    next_steps = models.TextField(blank=True, help_text="Next steps planned")
    reported_by = models.ForeignKey(ClientUser, on_delete=models.SET_NULL, null=True)
    reported_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['project', 'target']
        ordering = ['-reported_at']

    def __str__(self):
        return f"{self.project.name} - {self.target}"


class SDGIndicator(models.Model):
    goal = models.ForeignKey(SDGGoal, on_delete=models.CASCADE)
    target_number = models.CharField(max_length=10)  # e.g., "1.1"
    indicator_number = models.CharField(max_length=10)  # e.g., "1.1.1"
    title = models.CharField(max_length=500)
    description = models.TextField()

    class Meta:
        unique_together = ['indicator_number']
        ordering = ['indicator_number']
