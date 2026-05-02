from rest_framework import serializers
from .models import Prompt
from apps.users.serializers import UserSerializer


class PromptSerializer(serializers.ModelSerializer):
    """Serializer for Prompt model."""
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = Prompt
        fields = [
            'id', 'title', 'description', 'category',
            'project_type', 'target_audience', 'tech_preferences',
            'requirements', 'constraints', 'generated_prompt',
            'tech_stack_suggestions', 'api_guidance', 'environment_setup',
            'created_by', 'created_at', 'updated_at',
            'is_public', 'is_favorite'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by']


class PromptListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for prompt lists."""
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = Prompt
        fields = [
            'id', 'title', 'description', 'category',
            'project_type', 'created_by_username', 'created_at',
            'is_public', 'is_favorite'
        ]


class PromptCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new prompts (input only)."""
    
    class Meta:
        model = Prompt
        fields = [
            'title', 'description', 'category',
            'project_type', 'target_audience', 'tech_preferences',
            'requirements', 'constraints', 'is_public'
        ]
    
    def create(self, validated_data):
        """Generate the prompt content on creation."""
        # Generate the AI prompt based on input
        generated_content = self._generate_prompt(validated_data)
        
        # Add generated content to validated data
        validated_data['generated_prompt'] = generated_content['prompt']
        validated_data['tech_stack_suggestions'] = generated_content['tech_stack']
        validated_data['api_guidance'] = generated_content['api_guidance']
        validated_data['environment_setup'] = generated_content['environment_setup']
        
        return super().create(validated_data)
    
    def _generate_prompt(self, data):
        """Generate AI-style prompt content based on user input."""
        title = data.get('title', '')
        project_type = data.get('project_type', '')
        requirements = data.get('requirements', '')
        tech_preferences = data.get('tech_preferences', '')
        target_audience = data.get('target_audience', '')
        constraints = data.get('constraints', '')
        category = data.get('category', 'developer')
        
        # Build the prompt
        prompt = f"""# Project: {title}

## Overview
Build a {project_type} for {target_audience or 'target users'}.

## Project Requirements
{requirements}

## Technical Context
- **Category**: {category.replace('_', ' ').title()}
- **Preferred Technologies**: {tech_preferences or 'Best-suited technologies will be suggested'}

## Constraints
{constraints or 'Standard development practices apply.'}

## Deliverables
1. Complete source code with modular architecture
2. API documentation (if applicable)
3. Environment setup guide
4. Testing strategy and test cases
5. Deployment configuration

## Success Criteria
- Clean, maintainable code following best practices
- Comprehensive error handling
- Well-documented functions and APIs
- Production-ready configuration
"""
        
        # Generate tech stack suggestions based on category and preferences
        tech_stack = self._suggest_tech_stack(category, project_type, tech_preferences)
        
        # Generate API guidance
        api_guidance = self._generate_api_guidance(project_type, tech_stack)
        
        # Generate environment setup
        environment_setup = self._generate_environment_setup(tech_stack)
        
        return {
            'prompt': prompt,
            'tech_stack': tech_stack,
            'api_guidance': api_guidance,
            'environment_setup': environment_setup
        }
    
    def _suggest_tech_stack(self, category, project_type, preferences):
        """Suggest tech stack based on category and project type."""
        stacks = {
            'developer': ['Python', 'Django/Flask', 'PostgreSQL', 'Redis', 'Docker'],
            'data_scientist': ['Python', 'Jupyter', 'Pandas', 'Scikit-learn', 'TensorFlow/PyTorch'],
            'devops': ['Docker', 'Kubernetes', 'Terraform', 'AWS/GCP', 'CI/CD Pipeline'],
            'designer': ['Figma', 'Adobe Creative Suite', 'Design Systems', 'Prototyping Tools'],
            'web_developer': ['React/Vue', 'Node.js', 'PostgreSQL/MongoDB', 'Tailwind CSS', 'Vercel/Netlify'],
            'mobile_developer': ['React Native/Flutter', 'Firebase', 'REST/GraphQL APIs', 'Mobile Analytics'],
            'ai_engineer': ['Python', 'PyTorch/TensorFlow', 'Hugging Face', 'FastAPI', 'Vector DBs'],
        }
        
        base_stack = stacks.get(category, ['Python', 'Django', 'PostgreSQL'])
        
        if preferences:
            return base_stack + [f"User Preference: {preferences}"]
        
        return base_stack
    
    def _generate_api_guidance(self, project_type, tech_stack):
        """Generate API usage guidance."""
        return f"""# API Integration Guide

## Authentication
- Use JWT or OAuth 2.0 for secure API access
- Implement token refresh mechanisms
- Store tokens securely (HttpOnly cookies recommended)

## Rate Limiting
- Implement rate limiting: 1000 requests/hour default
- Include rate limit headers in responses
- Handle 429 responses with exponential backoff

## Endpoints Structure
- Follow RESTful conventions
- Use plural nouns for resources (/users, /projects)
- Version your API (/api/v1/...)

## Error Handling
- Return consistent error response format
- Use appropriate HTTP status codes
- Include error codes for client-side handling

## Documentation
- Use OpenAPI/Swagger for auto-generated docs
- Include request/response examples
- Document authentication requirements per endpoint
"""
    
    def _generate_environment_setup(self, tech_stack):
        """Generate environment setup instructions."""
        return f"""# Environment Setup

## Prerequisites
- Python 3.9+ installed
- Node.js 18+ (for frontend)
- Docker (optional, for containerization)
- Git

## Backend Setup
```bash
# Clone repository
git clone <repository-url>
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver
```

## Frontend Setup
```bash
cd Frontend-Web
npm install
cp .env.example .env.local
npm run dev
```

## Database Setup (Supabase)
1. Create project at https://supabase.com
2. Get connection string from Settings > Database
3. Add credentials to .env file
4. Run migrations: `python manage.py migrate`

## Verification
- Backend: http://localhost:8000/api/health/
- Frontend: http://localhost:5173
"""


class PromptUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating existing prompts."""
    
    class Meta:
        model = Prompt
        fields = [
            'title', 'description', 'category',
            'project_type', 'target_audience', 'tech_preferences',
            'requirements', 'constraints', 'is_public', 'is_favorite'
        ]
