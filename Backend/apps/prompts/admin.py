from django.contrib import admin
from .models import Prompt


@admin.register(Prompt)
class PromptAdmin(admin.ModelAdmin):
    """Admin configuration for Prompt model."""
    list_display = ['title', 'category', 'project_type', 'created_by', 'created_at', 'is_public']
    list_filter = ['category', 'is_public', 'is_favorite', 'created_at']
    search_fields = ['title', 'description', 'requirements']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = [
        ('Basic Info', {
            'fields': ['title', 'description', 'category', 'project_type']
        }),
        ('Input Details', {
            'fields': ['target_audience', 'tech_preferences', 'requirements', 'constraints']
        }),
        ('Generated Content', {
            'fields': ['generated_prompt', 'tech_stack_suggestions', 'api_guidance', 'environment_setup'],
            'classes': ['collapse']
        }),
        ('Settings', {
            'fields': ['is_public', 'is_favorite', 'created_by']
        }),
        ('Timestamps', {
            'fields': ['created_at', 'updated_at'],
            'classes': ['collapse']
        }),
    ]
