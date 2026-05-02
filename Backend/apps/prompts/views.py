from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.db.models import Q
from django.shortcuts import get_object_or_404

from .models import Prompt
from .serializers import (
    PromptSerializer,
    PromptListSerializer,
    PromptCreateSerializer,
    PromptUpdateSerializer
)


class PromptListCreateView(generics.ListCreateAPIView):
    """List all prompts or create a new one."""
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'category', 'project_type']
    ordering_fields = ['created_at', 'updated_at', 'title']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PromptCreateSerializer
        return PromptListSerializer
    
    def get_queryset(self):
        """Return prompts visible to the current user."""
        user = self.request.user
        queryset = Prompt.objects.filter(
            Q(is_public=True) | Q(created_by=user)
        )
        
        # Filter by category if provided
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter by my prompts only
        mine_only = self.request.query_params.get('mine', '').lower() == 'true'
        if mine_only:
            queryset = queryset.filter(created_by=user)
        
        return queryset.select_related('created_by')
    
    def perform_create(self, serializer):
        """Set the created_by field to current user."""
        serializer.save(created_by=self.request.user)


class PromptDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a prompt."""
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return PromptUpdateSerializer
        return PromptSerializer
    
    def get_queryset(self):
        """Return prompts the user can access."""
        user = self.request.user
        return Prompt.objects.filter(
            Q(is_public=True) | Q(created_by=user)
        ).select_related('created_by')
    
    def check_object_permissions(self, request, obj):
        """Only allow editing by the creator."""
        super().check_object_permissions(request, obj)
        if request.method in ['PUT', 'PATCH', 'DELETE']:
            if obj.created_by != request.user:
                self.permission_denied(request, message="You can only modify your own prompts.")


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_favorite(request, pk):
    """Toggle favorite status for a prompt."""
    prompt = get_object_or_404(Prompt, pk=pk)
    
    # Check if user owns the prompt
    if prompt.created_by != request.user:
        return Response(
            {'error': 'You can only favorite your own prompts.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    prompt.is_favorite = not prompt.is_favorite
    prompt.save(update_fields=['is_favorite'])
    
    return Response({
        'message': f'Prompt {"added to" if prompt.is_favorite else "removed from"} favorites',
        'is_favorite': prompt.is_favorite
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def regenerate_prompt(request, pk):
    """Regenerate the AI prompt for an existing prompt."""
    prompt = get_object_or_404(Prompt, pk=pk)
    
    # Only allow regeneration by the creator
    if prompt.created_by != request.user:
        return Response(
            {'error': 'You can only regenerate your own prompts.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Create a new serializer instance to regenerate content
    serializer = PromptCreateSerializer(data={
        'title': prompt.title,
        'description': prompt.description,
        'category': prompt.category,
        'project_type': prompt.project_type,
        'target_audience': prompt.target_audience,
        'tech_preferences': prompt.tech_preferences,
        'requirements': prompt.requirements,
        'constraints': prompt.constraints,
        'is_public': prompt.is_public,
    })
    
    if serializer.is_valid():
        # Get generated content
        generated = serializer._generate_prompt(serializer.validated_data)
        
        # Update the prompt
        prompt.generated_prompt = generated['prompt']
        prompt.tech_stack_suggestions = generated['tech_stack']
        prompt.api_guidance = generated['api_guidance']
        prompt.environment_setup = generated['environment_setup']
        prompt.save()
        
        return Response({
            'message': 'Prompt regenerated successfully',
            'prompt': PromptSerializer(prompt).data
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_prompts(request):
    """Get all prompts created by the current user."""
    prompts = Prompt.objects.filter(created_by=request.user)
    
    # Filter by favorites
    favorites_only = request.query_params.get('favorites', '').lower() == 'true'
    if favorites_only:
        prompts = prompts.filter(is_favorite=True)
    
    serializer = PromptListSerializer(prompts, many=True)
    return Response({
        'count': len(serializer.data),
        'prompts': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def favorite_prompts(request):
    """Get all favorite prompts for the current user."""
    prompts = Prompt.objects.filter(created_by=request.user, is_favorite=True)
    serializer = PromptListSerializer(prompts, many=True)
    return Response({
        'count': len(serializer.data),
        'prompts': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def public_prompts(request):
    """Get all public prompts."""
    prompts = Prompt.objects.filter(is_public=True)
    
    # Filter by category
    category = request.query_params.get('category')
    if category:
        prompts = prompts.filter(category=category)
    
    serializer = PromptListSerializer(prompts, many=True)
    return Response({
        'count': len(serializer.data),
        'prompts': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_categories(request):
    """Get all available prompt categories."""
    categories = [
        {'value': 'developer', 'label': 'Developer'},
        {'value': 'data_scientist', 'label': 'Data Scientist'},
        {'value': 'devops', 'label': 'DevOps'},
        {'value': 'designer', 'label': 'Designer'},
        {'value': 'product_manager', 'label': 'Product Manager'},
        {'value': 'mobile_developer', 'label': 'Mobile Developer'},
        {'value': 'ai_engineer', 'label': 'AI/ML Engineer'},
        {'value': 'web_developer', 'label': 'Web Developer'},
        {'value': 'other', 'label': 'Other'},
    ]
    return Response({'categories': categories}, status=status.HTTP_200_OK)
