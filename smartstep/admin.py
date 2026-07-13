from django.contrib import admin

from .models import Chapter, Course, Progress, Step


class ChapterInline(admin.TabularInline):
    model = Chapter
    extra = 1
    fields = ['order', 'emoji', 'name', 'slug', 'goal', 'minutes']


class StepInline(admin.TabularInline):
    model = Step
    extra = 1
    fields = ['order', 'instruction', 'html']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['order', '__str__', 'slug', 'chapter_count']
    list_display_links = ['__str__']
    inlines = [ChapterInline]

    @admin.display(description='챕터 수')
    def chapter_count(self, obj):
        return obj.chapters.count()


@admin.register(Chapter)
class ChapterAdmin(admin.ModelAdmin):
    list_display = ['order', '__str__', 'course', 'slug', 'minutes', 'step_count']
    list_display_links = ['__str__']
    list_filter = ['course']
    inlines = [StepInline]

    @admin.display(description='스텝 수')
    def step_count(self, obj):
        return obj.steps.count()


@admin.register(Progress)
class ProgressAdmin(admin.ModelAdmin):
    list_display = ['session_key', 'chapter', 'last_step', 'is_completed', 'updated_at']
    list_filter = ['is_completed', 'chapter']
    readonly_fields = ['updated_at']
