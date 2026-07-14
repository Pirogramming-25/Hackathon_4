import json

from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST, require_http_methods

from .models import Chapter, Course, Progress


def _session_key(request):
    """익명 사용자의 식별자. 첫 방문에는 세션 키가 없으므로 여기서 만들어준다."""
    if not request.session.session_key:
        request.session.create()
    return request.session.session_key


def _error(message, status):
    return JsonResponse({'detail': message}, status=status)


def csrf_failure(request, reason=''):
    """CSRF 실패도 HTML이 아닌 JSON으로 응답한다. (settings.CSRF_FAILURE_VIEW)"""
    return _error('CSRF 검증에 실패했습니다.', 403)


def _completed_slugs(key, course=None):
    rows = Progress.objects.filter(session_key=key, is_completed=True)
    if course is not None:
        rows = rows.filter(chapter__course=course)
    return set(rows.values_list('chapter__slug', flat=True))


def _course_progress(course, key):
    """코스 진행률. 프론트가 계산하지 않도록 서버가 내려준다."""
    total = course.chapters.count()
    done = Progress.objects.filter(
        session_key=key, chapter__course=course, is_completed=True
    ).count()
    return {
        'chapters_done': done,
        'chapters_total': total,
        'percent': round(done / total * 100) if total else 0,
    }


def _chapter_brief(chapter):
    return {'slug': chapter.slug, 'emoji': chapter.emoji, 'name': chapter.name}


@ensure_csrf_cookie
@require_GET
def course_list(request):
    """코스 목록 + 코스별 진행률.

    프론트가 POST/PATCH에 쓸 CSRF 토큰이 필요하므로, 이 응답에서
    csrftoken 쿠키를 함께 내려준다.
    """
    key = _session_key(request)
    data = [
        {
            'slug': course.slug,
            'emoji': course.emoji,
            'name': course.name,
            'description': course.description,
            **_course_progress(course, key),
        }
        for course in Course.objects.all()
    ]
    return JsonResponse(data, safe=False)


@ensure_csrf_cookie
@require_GET
def course_detail(request, slug):
    """코스 상세 + 챕터별 완료 여부."""
    try:
        course = Course.objects.prefetch_related('chapters').get(slug=slug)
    except Course.DoesNotExist:
        return _error('코스를 찾을 수 없습니다.', 404)

    done = _completed_slugs(_session_key(request), course)
    return JsonResponse(
        {
            'slug': course.slug,
            'emoji': course.emoji,
            'name': course.name,
            'chapters': [
                {
                    'slug': ch.slug,
                    'emoji': ch.emoji,
                    'name': ch.name,
                    'goal': ch.goal,
                    'minutes': ch.minutes,
                    'order': ch.order,
                    'is_completed': ch.slug in done,
                }
                for ch in course.chapters.all()
            ],
        }
    )


@ensure_csrf_cookie
@require_GET
def chapter_steps(request, slug):
    """실습 화면용. 스텝 목록과 이어보기 위치(last_step)를 한 번에 내려준다.

    학습 화면 진입 시 가장 먼저 호출되는 GET이므로, 이후 PATCH/POST에 필요한
    csrftoken 쿠키를 여기서 확보하게 된다.
    """
    try:
        chapter = Chapter.objects.select_related('course').prefetch_related('steps').get(
            slug=slug
        )
    except Chapter.DoesNotExist:
        return _error('챕터를 찾을 수 없습니다.', 404)

    progress = Progress.objects.filter(
        session_key=_session_key(request), chapter=chapter
    ).first()

    return JsonResponse(
        {
            'chapter': _chapter_brief(chapter),
            'course': {'slug': chapter.course.slug, 'name': chapter.course.name},
            'steps': [
                {'order': s.order, 'instruction': s.instruction, 'html': s.html}
                for s in chapter.steps.all()
            ],
            'is_completed': progress.is_completed if progress else False,
            'last_step': progress.last_step if progress else 0,
        }
    )


@ensure_csrf_cookie
@require_GET
def progress_continue(request):
    """이어하기 배너용. 완료되지 않은 진도 중 가장 최근 1건. 없으면 null."""
    progress = (
        Progress.objects.filter(session_key=_session_key(request), is_completed=False)
        .select_related('chapter')
        .order_by('-updated_at')
        .first()
    )
    if progress is None:
        return JsonResponse(None, safe=False)

    return JsonResponse(
        {'chapter': _chapter_brief(progress.chapter), 'last_step': progress.last_step}
    )


@require_http_methods(['PATCH'])
def progress_update(request, chapter_slug):
    """스텝 이동마다 호출되는 부분 갱신. last_step 하나만 바꾼다."""
    try:
        chapter = Chapter.objects.get(slug=chapter_slug)
    except Chapter.DoesNotExist:
        return _error('챕터를 찾을 수 없습니다.', 404)

    try:
        last_step = int(json.loads(request.body or '{}')['last_step'])
    except (json.JSONDecodeError, KeyError, TypeError, ValueError):
        return _error('last_step 값이 올바르지 않습니다.', 400)

    if last_step < 0:
        return _error('last_step 값이 올바르지 않습니다.', 400)

    progress, _ = Progress.objects.update_or_create(
        session_key=_session_key(request),
        chapter=chapter,
        defaults={'last_step': last_step},
    )
    return JsonResponse(
        {
            'chapter_slug': chapter.slug,
            'last_step': progress.last_step,
            'is_completed': progress.is_completed,
        }
    )


@require_POST
def progress_complete(request, chapter_slug):
    """챕터 완료 처리. complete 화면이 바로 쓸 수 있도록 코스 진행률까지 함께 반환한다."""
    try:
        chapter = Chapter.objects.select_related('course').get(slug=chapter_slug)
    except Chapter.DoesNotExist:
        return _error('챕터를 찾을 수 없습니다.', 404)

    key = _session_key(request)
    Progress.objects.update_or_create(
        session_key=key,
        chapter=chapter,
        defaults={'is_completed': True},
    )

    course = chapter.course
    return JsonResponse(
        {
            'chapter': _chapter_brief(chapter),
            'course': {
                'slug': course.slug,
                'name': course.name,
                **_course_progress(course, key),
            },
        }
    )
