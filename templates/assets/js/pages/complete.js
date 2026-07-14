import { api } from "../api.js";

const params = new URLSearchParams(location.search);
const chapterId = params.get("chapter");
const root = document.getElementById("complete-root");

function showError(message) {
  root.innerHTML = `
    <p class="title-md">${message}</p>
    <a class="btn-primary mt-6" href="courses.html">코스 목록으로</a>`;
}

async function main() {
  if (!chapterId) {
    showError("챕터를 찾을 수 없어요.");
    return;
  }

  let data;
  try {
    data = await api.post(`/progress/${encodeURIComponent(chapterId)}/complete/`);
  } catch (err) {
    showError(err.message);
    return;
  }

  const { chapter, course } = data;
  document.title = `${chapter.name} 완료 — 스마트 한걸음`;
  root.innerHTML = `
    <span style="font-size:4.5rem;" aria-hidden="true">🎉</span>
    <h1 class="title-xl mt-6">축하합니다!</h1>
    <p class="mt-4" style="font-size:1.5rem;color:var(--foreground);">
      <span aria-hidden="true">${chapter.emoji}</span>
      <strong>${chapter.name}</strong> 학습을 마쳤어요.
    </p>
    <div class="card mt-8" style="width:100%;">
      <p class="font-bold" style="font-size:1.125rem;color:var(--muted-foreground);">${course.name} 진행률</p>
      <div class="progress mt-3" style="height:1.25rem;" role="progressbar"
        aria-valuenow="${course.percent}" aria-valuemin="0" aria-valuemax="100"
        aria-label="${course.name} 진행률 ${course.percent}%">
        <div class="progress__bar" style="width:${course.percent}%"></div>
      </div>
      <p class="mt-3 font-bold" style="font-size:1.25rem;color:var(--foreground);">
        ${course.chapters_done} / ${course.chapters_total} 챕터 완료
      </p>
    </div>
    <a href="course.html?id=${course.slug}" class="btn-primary mt-8" style="width:100%;font-size:1.5rem;min-height:4rem;">
      코스 목록으로 돌아가기
    </a>`;
}

main();
