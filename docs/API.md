# API 명세 — 진도 저장

로그인이 없으므로 **Django 세션 쿠키(`sessionid`)로 사용자를 식별**한다.
프론트는 `fetch` 호출 시 반드시 `credentials: "same-origin"`을 붙여 쿠키를 함께 보내야 한다.

---

## CSRF 처리 (중요)

POST 요청에는 `X-CSRFToken` 헤더가 필요하다. 없으면 **403**이 난다.

토큰은 **`GET /api/progress/` 응답에서 `csrftoken` 쿠키로 내려온다.**
프론트는 페이지 로드 시 진도를 먼저 조회하므로, 그 시점에 토큰을 확보하게 된다.

```js
function csrfToken() {
  return document.cookie.match(/csrftoken=([^;]+)/)?.[1] ?? "";
}

async function post(url, body) {
  const res = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken(),
    },
    body: JSON.stringify(body),
  });
  return res.json();
}
```

---

## 1. 진도 조회

```
GET /api/progress/
```

완료한 챕터 목록과 "이어서 하기" 위치를 함께 내려준다.
(`csrftoken` 쿠키도 이 응답에서 함께 발급된다.)

**응답 200**

```json
{
  "completed": ["call", "wifi"],
  "last": { "chapterId": "message", "step": 3 }
}
```

- `completed` — 완주한 챕터 slug 목록. 코스 진행률 계산에 사용.
- `last` — 아직 끝내지 않은 챕터 중 **가장 최근에 본 것**. 없으면 `null`.

## 2. 스텝 위치 저장

```
POST /api/progress/step/
```

사용자가 다음/이전 단계로 이동할 때마다 호출한다. (기존 `saveLast`)

**요청**

```json
{ "chapter": "message", "step": 3 }
```

**응답 200**

```json
{ "chapterId": "message", "step": 3 }
```

## 3. 챕터 완료

```
POST /api/progress/complete/
```

마지막 스텝을 마쳤을 때 호출한다. (기존 `markComplete` + `clearLast`)
완료 처리와 동시에 `last_step`이 0으로 초기화되어 "이어서 하기" 대상에서 빠진다.

**요청**

```json
{ "chapter": "call" }
```

**응답 200**

```json
{ "chapterId": "call", "completed": true }
```

---

## 오류 응답

| 상황 | 코드 |
| --- | --- |
| 없는 챕터 slug | `404` |
| `X-CSRFToken` 헤더 누락 | `403` |
| `step`이 정수가 아님 | `400` |
| GET 자리에 POST (또는 반대) | `405` |

---

## 프론트 교체 대상

기존 `assets/js/progress.js`는 localStorage를 쓴다. 아래처럼 1:1로 바뀐다.

| 기존 함수 | 대체 |
| --- | --- |
| `getCompleted()` / `getLast()` | `GET /api/progress/` |
| `saveLast(chapterId, step)` | `POST /api/progress/step/` |
| `markComplete(chapterId)` | `POST /api/progress/complete/` |
| `clearLast()` | 불필요 (complete가 처리) |

> 서버 호출은 비동기이므로, 기존 동기 함수를 쓰던 `pages/*.js`는 `await`로 바꿔야 한다.
