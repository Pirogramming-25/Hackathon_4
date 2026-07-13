"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.views.generic import TemplateView

# 프론트 JS가 course.html?id=... 형태로 링크를 만들므로, 그 경로를 그대로 서빙한다.
# (pages/*.js를 건드리지 않기 위한 선택. 주소 정리는 발표 후 별도 PR에서.)
PAGES = ['index', 'courses', 'course', 'learn', 'complete']

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('smartstep.urls')),
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
    *[
        path(
            f'{name}.html',
            TemplateView.as_view(template_name=f'{name}.html'),
            name=name,
        )
        for name in PAGES
    ],
]
