from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Prompt(models.Model):
    """Model for storing AI-generated prompts."""
    
    CATEGORY_CHOICES = [
        ('developer', 'Developer'),
        ('data_scientist', 'Data Scientist'),
        ('devops', 'DevOps'),
        ('designer', 'Designer'),
        ('product_manager', 'Product Manager'),
        ('mobile_developer', 'Mobile Developer'),
        ('ai_engineer', 'AI/ML Engineer'),
        ('web_developer', 'Web Developer'),
        ('other', 'Other'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField(help_text="Brief description of the project requirements")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='developer')
    
    # Input fields for prompt generation
    project_type = models.CharField(max_length=100, help_text="Type of project (e.g., Web App, API, Dashboard)")
    target_audience = models.CharField(max_length=255, blank=True, null=True, help_text="Target users/audience")
    tech_preferences = models.TextField(blank=True, null=True, help_text="Preferred technologies or frameworks")
    requirements = models.TextField(help_text="Detailed project requirements and features")
    constraints = models.TextField(blank=True, null=True, help_text="Any constraints or limitations")
    
    # Generated output
    generated_prompt = models.TextField(help_text="The AI-generated prompt")
    tech_stack_suggestions = models.JSONField(default=list, blank=True, help_text="Suggested tech stack")
    api_guidance = models.TextField(blank=True, null=True, help_text="API usage guidance")
    environment_setup = models.TextField(blank=True, null=True, help_text="Environment setup instructions")
    
    # Metadata
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='prompts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_public = models.BooleanField(default=False, help_text="Whether this prompt is publicly visible")
    is_favorite = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'prompts'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['category']),
            models.Index(fields=['created_by']),
            models.Index(fields=['is_public']),
        ]
    
    def __str__(self):
        return f"{self.title} ({self.category})"
