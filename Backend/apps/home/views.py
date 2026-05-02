from datetime import datetime
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Health check endpoint for monitoring."""
    return Response({
        'status': 'healthy',
        'message': 'WebByPrompt API is running',
        'timestamp': str(datetime.now()) if 'datetime' in dir() else 'active'
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def landing_page(request):
    """Landing page API with platform information."""
    return Response({
        'name': 'WebByPrompt',
        'tagline': 'Generate high-quality prompts for your software projects',
        'description': 'A platform for developers and data scientists to generate AI-powered prompts for building real-world software projects.',
        'features': [
            {
                'title': 'Smart Prompt Generation',
                'description': 'AI-powered prompts with full project understanding'
            },
            {
                'title': 'Tech Stack Suggestions',
                'description': 'Get recommendations for the best technologies'
            },
            {
                'title': 'API Integration Guidance',
                'description': 'Comprehensive API usage instructions'
            },
            {
                'title': 'Environment Setup',
                'description': 'Step-by-step environment configuration'
            }
        ],
        'stats': {
            'prompts_generated': 0,
            'active_users': 0,
            'categories': ['Developer', 'Data Scientist', 'DevOps', 'Designer']
        }
    }, status=status.HTTP_200_OK)
