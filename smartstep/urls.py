from django.urls import path

from . import views

app_name = 'smartstep'

urlpatterns = [
    path('progress/', views.progress_detail, name='progress-detail'),
    path('progress/step/', views.save_step, name='progress-step'),
    path('progress/complete/', views.complete_chapter, name='progress-complete'),
]
