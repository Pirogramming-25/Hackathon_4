import { api } from "../api.js";

async function loadCourse() {
  const params = new URLSearchParams(location.search);
  const courseId = params.get("id");
  const root = document.getElementById("course-root");

  let course;
  try {
    course = await api.get(`/courses/${courseId}/`);
  } catch (err) {
    root.innerHTML = `
      <p class="title-md">${err.message || "코스를 찾을 수 없어요."}</p>
      <a class="btn-primary mt-6" href="courses.html">코스 목록으로</a>`;
    return;
  }

  document.title = `${course.name} — 스마트 한걸음`;
  root.innerHTML = `
    <a href="index.html" class="back-link">← 처음으로</a>
    <h1 class="title-lg mt-4 flex items-center gap-3">
      <span aria-hidden="true">${course.emoji}</span> ${course.name}
    </h1>
    <p class="text-lg mt-2">위에서부터 순서대로 하나씩 배워요.</p>
    <ul class="chapter-list mt-8">
      ${course.chapters
        .map((chapter, i) => {
          const done = chapter.is_completed;
          return `
            <li class="chapter-card">
              <span class="emoji" aria-hidden="true">${chapter.emoji}</span>
              <div class="chapter-card__body">
                <div class="chapter-card__head">
                  <h2 class="title-md">${i + 1}. ${chapter.name}</h2>
                  <span class="badge ${done ? "badge--done" : "badge--todo"}">
                    ${done ? "✓ 완료" : "학습 전"}
                  </span>
                </div>
                <p class="text-lg mt-2">${chapter.goal}</p>
                <p class="text-base mt-2">⏱️ 약 ${chapter.minutes}분</p>
              </div>
              <a href="learn.html?chapter=${chapter.slug}" class="btn-primary" style="min-height:3.5rem;padding:0 2rem;">
                ${done ? "다시 하기" : "시작하기"}
              </a>
            </li>`;
        })
        .join("")}
    </ul>`;
}

loadCourse();
