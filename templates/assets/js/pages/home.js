import { api } from "../api.js";

async function loadContinueBanner() {
  const el = document.getElementById("continue-slot");
  if (!el) return;

  let data;
  try {
    data = await api.get("/progress/continue/");
  } catch (err) {
    return; // 실패하면 배너 없이 조용히 넘어감
  }

  if (!data) return; // 이어할 게 없으면 null

  el.innerHTML = `
    <a href="learn.html?chapter=${encodeURIComponent(data.chapter.slug)}" class="continue-btn">
      <span aria-hidden="true">▶️</span> 최근 학습 이어하기 — ${data.chapter.name}
    </a>`;
}

loadContinueBanner();