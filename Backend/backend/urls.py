"""
URL configuration for backend project.
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


def api_root(request):
    """API root endpoint."""
    return JsonResponse({
        "message": "Welcome to WebByPrompt API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/api/health/",
            "prompts": "/api/prompts/",
            "auth": {
                "token": "/api/token/",
                "refresh": "/api/token/refresh/",
                "register": "/api/auth/register/",
            }
        }
    })


urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    
    # JWT Authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # App routes
    path('api/', include('apps.home.urls')),
    path('api/auth/', include('apps.users.urls')),
    path('api/prompts/', include('apps.prompts.urls')),
]
