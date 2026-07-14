import { api } from "../api.js";

async function loadCourses() {
  const container = document.getElementById("courses-list");

  let courses;
  try {
    courses = await api.get("/courses/");
  } catch (err) {
    container.innerHTML = `<p>코스를 불러오지 못했어요. 잠시 후 다시 시도해주세요.</p>`;
    return;
  }

  container.innerHTML = courses
    .map((course) => {
      const pct = course.percent;
      return `
        <div class="card">
          <div class="flex items-center gap-4">
            <span style="font-size:3rem;" aria-hidden="true">${course.emoji}</span>
            <div>
              <h2 class="title-md">${course.name}</h2>
              <p class="text-lg mt-2">${course.description}</p>
            </div>
          </div>
          <div class="mt-6">
            <div class="progress-row">
              <span>진행률</span>
              <span>${course.chapters_done} / ${course.chapters_total} 완료</span>
            </div>
            <div class="progress mt-2" role="progressbar"
              aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"
              aria-label="${course.name} 진행률 ${pct}%">
              <div class="progress__bar" style="width:${pct}%"></div>
            </div>
          </div>
          <a class="btn-primary mt-6" href="course.html?id=${course.slug}">학습 시작 →</a>
        </div>`;
    })
    .join("");
}

loadCourses();