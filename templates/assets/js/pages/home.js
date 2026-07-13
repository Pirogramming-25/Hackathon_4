import { getLast } from "../progress.js";
import { findChapter } from "../courses.js";

const last = getLast();
const info = last ? findChapter(last.chapterId) : null;
const el = document.getElementById("continue-slot");
if (info && last && el) {
  el.innerHTML = `
    <a href="learn.html?chapter=${encodeURIComponent(last.chapterId)}" class="continue-btn">
      <span aria-hidden="true">▶️</span> 최근 학습 이어하기 — ${info.chapter.name}
    </a>`;
}
