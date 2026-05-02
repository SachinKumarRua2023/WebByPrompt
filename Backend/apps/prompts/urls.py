from django.urls import path
from . import views

urlpatterns = [
    # CRUD endpoints
    path('', views.PromptListCreateView.as_view(), name='prompt-list-create'),
    path('<int:pk>/', views.PromptDetailView.as_view(), name='prompt-detail'),
    
    # Additional actions
    path('<int:pk>/toggle-favorite/', views.toggle_favorite, name='prompt-toggle-favorite'),
    path('<int:pk>/regenerate/', views.regenerate_prompt, name='prompt-regenerate'),
    path('my-prompts/', views.my_prompts, name='my-prompts'),
    path('favorites/', views.favorite_prompts, name='favorite-prompts'),
    path('public/', views.public_prompts, name='public-prompts'),
    path('categories/', views.get_categories, name='prompt-categories'),
]
