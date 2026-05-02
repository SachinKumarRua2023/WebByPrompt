from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('me/', views.get_current_user, name='current-user'),
    path('me/update/', views.update_profile, name='update-profile'),
    path('list/', views.list_users, name='list-users'),
]
