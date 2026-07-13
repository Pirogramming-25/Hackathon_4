import { findChapter } from "../courses.js";
import { getCompleted } from "../progress.js";

const params = new URLSearchParams(location.search);
const chapterId = params.get("chapter");
const info = findChapter(chapterId);
const root = document.getElementById("complete-root");

if (!info) {
  root.innerHTML = `
    <p class="title-md">챕터를 찾을 수 없어요.</p>
    <a class="btn-primary mt-6" href="courses.html">코스 목록으로</a>`;
} else {
  const completed = getCompleted();
  const done = info.course.chapters.filter((c) => completed.includes(c.id)).length;
  const pct = Math.round((done / info.course.chapters.length) * 100);
  document.title = `${info.chapter.name} 완료 — 스마트 한걸음`;
  root.innerHTML = `
    <span style="font-size:4.5rem;" aria-hidden="true">🎉</span>
    <h1 class="title-xl mt-6">축하합니다!</h1>
    <p class="mt-4" style="font-size:1.5rem;color:var(--foreground);">
      <span aria-hidden="true">${info.chapter.emoji}</span>
      <strong>${info.chapter.name}</strong> 학습을 마쳤어요.
    </p>
    <div class="card mt-8" style="width:100%;">
      <p class="font-bold" style="font-size:1.125rem;color:var(--muted-foreground);">${info.course.name} 진행률</p>
      <div class="progress mt-3" style="height:1.25rem;" role="progressbar"
        aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"
        aria-label="${info.course.name} 진행률 ${pct}%">
        <div class="progress__bar" style="width:${pct}%"></div>
      </div>
      <p class="mt-3 font-bold" style="font-size:1.25rem;color:var(--foreground);">
        ${done} / ${info.course.chapters.length} 챕터 완료
      </p>
    </div>
    <a href="course.html?id=${info.course.id}" class="btn-primary mt-8" style="width:100%;font-size:1.5rem;min-height:4rem;">
      코스 목록으로 돌아가기
    </a>`;
}
