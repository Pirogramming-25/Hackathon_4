from django.urls import path

from . import views

app_name = 'smartstep'

urlpatterns = [
    path('courses/', views.course_list, name='course-list'),
    path('courses/<slug:slug>/', views.course_detail, name='course-detail'),
    path('progress/continue/', views.progress_continue, name='progress-continue'),
    path('progress/<slug:chapter_slug>/', views.progress_update, name='progress-update'),
    path(
        'progress/<slug:chapter_slug>/complete/',
        views.progress_complete,
        name='progress-complete',
    ),
]
