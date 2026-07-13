import json

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST

from .models import Chapter, Progress


def _session_key(request):
    """익명 사용자의 식별자. 첫 방문에는 세션 키가 없으므로 여기서 만들어준다."""
    if not request.session.session_key:
        request.session.create()
    return request.session.session_key


def _body(request):
    try:
        return json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return {}


@ensure_csrf_cookie
@require_GET
def progress_detail(request):
    """완료한 챕터 목록과 '이어서 하기' 위치를 함께 내려준다.

    프론트가 진도를 저장(POST)하려면 CSRF 토큰이 필요한데, 이 응답에서
    csrftoken 쿠키를 함께 내려주어 첫 조회만으로 토큰을 확보하게 한다.
    """
    key = _session_key(request)
    rows = Progress.objects.filter(session_key=key).select_related('chapter')

    completed = [p.chapter.slug for p in rows if p.is_completed]

    # 아직 끝내지 않은 챕터 중 가장 최근에 본 것이 '이어서 하기' 대상이다.
    last = None
    for p in rows:  # Progress.Meta.ordering = ['-updated_at']
        if not p.is_completed:
            last = {'chapterId': p.chapter.slug, 'step': p.last_step}
            break

    return JsonResponse({'completed': completed, 'last': last})


@require_POST
def save_step(request):
    """현재 보고 있는 스텝 위치를 저장한다. (프론트의 saveLast)"""
    data = _body(request)
    chapter = get_object_or_404(Chapter, slug=data.get('chapter', ''))
    try:
        step = int(data.get('step', 0))
    except (TypeError, ValueError):
        return JsonResponse({'error': 'step은 정수여야 합니다.'}, status=400)

    progress, _ = Progress.objects.update_or_create(
        session_key=_session_key(request),
        chapter=chapter,
        defaults={'last_step': max(step, 0)},
    )
    return JsonResponse({'chapterId': chapter.slug, 'step': progress.last_step})


@require_POST
def complete_chapter(request):
    """챕터를 완료 처리한다. (프론트의 markComplete + clearLast)"""
    data = _body(request)
    chapter = get_object_or_404(Chapter, slug=data.get('chapter', ''))

    Progress.objects.update_or_create(
        session_key=_session_key(request),
        chapter=chapter,
        defaults={'is_completed': True, 'last_step': 0},
    )
    return JsonResponse({'chapterId': chapter.slug, 'completed': True})
