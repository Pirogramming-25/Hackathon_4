# API 명세 — 스마트 한걸음

> 프론트의 `courses.js`(하드코딩 배열), `lessons.js`(하드코딩 스텝), `progress.js`(localStorage)를
> 서버 API 호출로 대체하기 위한 명세. 모델은 [`smartstep/models.py`](../smartstep/models.py),
> 설계 배경은 [`ERD.md`](./ERD.md) 참고.

---

## 0. 공통 사항

### Base URL

모든 엔드포인트는 `/api/` 하위에 두고, Django 컨벤션에 따라 **트레일링 슬래시를 유지**한다.
예: `/api/courses/`, `/api/courses/smartphone/`.

### 인증 — 세션 쿠키

로그인이 없으므로 Django가 발급하는 세션 쿠키(`sessionid`)로 사용자를 식별한다.
`Progress.session_key`가 곧 `request.session.session_key`.

- Django는 세션에 아무것도 쓰기 전엔 쿠키를 내려주지 않는다. 첫 진입 시 세션이 없으면
  뷰(또는 미들웨어)에서 `request.session.save()`로 강제 생성해 쿠키를 확보한다.

### CSRF

`PATCH`/`POST` 요청은 Django CSRF 보호 대상이므로, 프론트는 쿠키의 `csrftoken` 값을
`X-CSRFToken` 헤더에 실어 보내야 한다. 첫 GET 응답(`/api/courses/` 등)에서
`ensure_csrf_cookie`로 `csrftoken` 쿠키를 같이 내려준다.

### 에러 포맷 (통일)

모든 에러 응답은 상태 코드와 무관하게 아래 하나의 형태로 통일한다.

```json
{ "detail": "코스를 찾을 수 없습니다." }
```

| 상황 | 상태 코드 |
| --- | --- |
| 존재하지 않는 slug 조회 | 404 |
| 요청 바디 검증 실패 (예: `last_step`이 정수가 아님) | 400 |
| CSRF 누락/세션 문제 | 403 |

### 진행률 계산 공통 로직

`chapters_done` / `chapters_total` / `percent`는 아래 쿼리로 서버가 계산해 내려준다.
프론트는 별도로 진행률을 계산하지 않는다.

```python
done = Progress.objects.filter(
    session_key=key, chapter__course=course, is_completed=True
).count()
total = course.chapters.count()
percent = round(done / total * 100) if total else 0
```

---

## 1. `GET /api/courses/`

**대응 화면**: `courses.js` (코스 목록 + 진행률)

코스 목록과 코스별 진행률을 반환한다. 기존 `courses` 배열 + `getCompleted()` 조합을 대체한다.

**Response 200**
```json
[
  {
    "slug": "smartphone",
    "emoji": "📱",
    "name": "스마트폰 기초",
    "description": "전화, 문자, 사진까지 스마트폰의 기본을 하나씩 배워요.",
    "chapters_done": 1,
    "chapters_total": 4,
    "percent": 25
  }
]
```

> `id`(PK)는 프론트가 쓰지 않으므로 노출하지 않는다. 모든 조회는 `slug` 기준.

---

## 2. `GET /api/courses/{slug}/`

**대응 화면**: `course.js` (코스 상세 + 챕터별 완료 여부)

**Response 200**
```json
{
  "slug": "smartphone",
  "emoji": "📱",
  "name": "스마트폰 기초",
  "chapters": [
    {
      "slug": "call",
      "emoji": "📞",
      "name": "전화",
      "goal": "전화를 걸고 끊는 방법을 배워요.",
      "minutes": 5,
      "order": 0,
      "is_completed": true
    }
  ]
}
```

**Response 404**
```json
{ "detail": "코스를 찾을 수 없습니다." }
```

---

## 3. `GET /api/chapters/{slug}/steps/`

**대응 화면**: `learn.js` (실습 스텝 진행)

`lessons.js`의 하드코딩 스텝 배열을 대체한다. 이어보기에 필요한 `last_step`도
같이 내려줘서, 프론트가 진도 조회를 별도 호출로 나누지 않게 한다.

**Response 200**
```json
{
  "chapter": { "slug": "call", "emoji": "📞", "name": "전화" },
  "course": { "slug": "smartphone", "name": "스마트폰 기초" },
  "steps": [
    { "order": 0, "instruction": "초록색 전화 앱을 눌러보세요.", "html": "<div>...</div>" },
    { "order": 1, "instruction": "숫자 버튼(키패드)을 눌러 전화번호를 입력해보세요.", "html": "<div>...</div>" }
  ],
  "is_completed": false,
  "last_step": 2
}
```

- `is_completed=true`인 챕터를 "다시 하기"로 여는 경우, 프론트는 `last_step`을 무시하고
  항상 `0`부터 시작한다.
- `is_completed=false`이고 `last_step`이 스텝 총 개수보다 작으면 그 위치부터 이어서 시작한다.

**Response 404**
```json
{ "detail": "챕터를 찾을 수 없습니다." }
```

---

## 4. `GET /api/progress/continue/`

**대응 화면**: `home.js` (최근 학습 이어하기 배너)

완료되지 않은 진도 중 가장 최근에 갱신된 1건을 반환한다.

```python
Progress.objects.filter(session_key=key, is_completed=False).order_by("-updated_at").first()
```

**Response 200 (있음)**
```json
{
  "chapter": { "slug": "message", "emoji": "💬", "name": "문자 보내기" },
  "last_step": 3
}
```

**Response 200 (없음)** — 204 대신 body 파싱을 단순하게 유지하기 위해 `null` 사용
```json
null
```

---

## 5. `PATCH /api/progress/{chapter_slug}/`

**대응 화면**: `learn.js` (`saveLast` — 스텝 이동마다 호출)

`last_step` 하나만 갱신하는 부분 수정이므로 `PUT`이 아닌 `PATCH`를 사용한다.
세션 + 챕터 기준으로 `get_or_create` 후 갱신한다 (`unique_together = ["session_key", "chapter"]`).

**Request**
```json
{ "last_step": 3 }
```

**Response 200**
```json
{ "chapter_slug": "call", "last_step": 3, "is_completed": false }
```

**Response 400** (예: `last_step`이 정수가 아니거나 음수)
```json
{ "detail": "last_step 값이 올바르지 않습니다." }
```

> 스텝 이동마다 호출되는 고빈도 요청이므로, 프론트는 이 호출을 **fire-and-forget**으로
> 처리하고 실패해도 학습 흐름(화면 전환)을 막지 않는다.

---

## 6. `POST /api/progress/{chapter_slug}/complete/`

**대응 화면**: `learn.js`의 `advance()` 마지막 스텝 분기 → `complete.js`

챕터를 완료 처리(`is_completed=True`, `last_step`=마지막 스텝)하고, `complete.js`가
바로 쓸 수 있도록 코스 진행률까지 한 번에 반환한다.

**Request**: 바디 없음

**Response 200**
```json
{
  "chapter": { "slug": "call", "emoji": "📞", "name": "전화" },
  "course": {
    "slug": "smartphone",
    "name": "스마트폰 기초",
    "chapters_done": 2,
    "chapters_total": 4,
    "percent": 50
  }
}
```

> 기존 `clearLast()`에 대응하는 별도 호출은 없다. `is_completed=True`가 되는 순간
> 4번(`/api/progress/continue/`) 쿼리에서 자연히 제외되므로 "이어하기" 상태가
> 별도 처리 없이 사라진다 (`ERD.md` §3 참고).

---

## 7. 엔드포인트 요약

| 메서드 | 경로 | 대응 화면 | 비고 |
| --- | --- | --- | --- |
| GET | `/api/courses/` | courses.js | 코스 목록 + 진행률 |
| GET | `/api/courses/{slug}/` | course.js | 코스 상세 + 챕터별 완료 여부 |
| GET | `/api/chapters/{slug}/steps/` | learn.js | 스텝 목록 + last_step |
| GET | `/api/progress/continue/` | home.js | 이어하기 배너 |
| PATCH | `/api/progress/{chapter_slug}/` | learn.js | 스텝 위치 저장 (fire-and-forget) |
| POST | `/api/progress/{chapter_slug}/complete/` | learn.js → complete.js | 완료 처리 + 코스 진행률 |
