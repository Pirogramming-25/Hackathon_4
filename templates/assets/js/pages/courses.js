import { courses } from "../courses.js";
import { getCompleted } from "../progress.js";

const completed = getCompleted();
const container = document.getElementById("courses-list");

container.innerHTML = courses
  .map((course) => {
    const done = course.chapters.filter((c) => completed.includes(c.id)).length;
    const pct = Math.round((done / course.chapters.length) * 100);
    return `
      <div class="card">
        <div class="flex items-center gap-4">
          <span style="font-size:3rem;" aria-hidden="true">${course.emoji}</span>
          <div>
            <h2 class="title-md">${course.name}</h2>
            <p class="text-lg mt-2">${course.desc}</p>
          </div>
        </div>
        <div class="mt-6">
          <div class="progress-row">
            <span>진행률</span>
            <span>${done} / ${course.chapters.length} 완료</span>
          </div>
          <div class="progress mt-2" role="progressbar"
            aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"
            aria-label="${course.name} 진행률 ${pct}%">
            <div class="progress__bar" style="width:${pct}%"></div>
          </div>
        </div>
        <a class="btn-primary mt-6" href="course.html?id=${course.id}">학습 시작 →</a>
      </div>`;
  })
  .join("");
