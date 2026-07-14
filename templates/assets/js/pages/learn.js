import { api } from "../api.js";
import { bindTaps } from "../phone.js";

const params = new URLSearchParams(location.search);
const chapterId = params.get("chapter");
const root = document.getElementById("learn-root");

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
    data = await api.get(`/chapters/${encodeURIComponent(chapterId)}/steps/`);
  } catch (err) {
    showError(err.message);
    return;
  }

  const { chapter, course, steps, is_completed, last_step } = data;
  const total = steps.length;
  document.title = `${chapter.name} 실습 — 스마트 한걸음`;

  // is_completed=true("다시 하기")면 last_step을 무시하고 0부터 시작한다 (API.md 3번).
  let step = !is_completed && last_step < total ? last_step : 0;
  let hint = false;
  let hintTimer;

  root.innerHTML = `
    <div class="learn-header">
      <a href="course.html?id=${course.slug}" class="back-link">← 나가기</a>
      <p class="title">${chapter.emoji} ${chapter.name}</p>
      <p class="step" id="step-label"></p>
    </div>
    <div class="progress mt-3" role="progressbar" aria-valuemin="0" aria-valuemax="100" id="prog-wrap">
      <div class="progress__bar" id="prog-bar"></div>
    </div>
    <div class="instruction-card mt-4">
      <p aria-live="polite" id="instruction"></p>
      <p class="instruction-hint" aria-live="assertive" id="hint" hidden>
        💡 주황색으로 반짝이는 곳을 눌러보세요!
      </p>
    </div>
    <div class="mt-6 flex-1" id="phone-slot"></div>
    <div class="learn-nav">
      <button type="button" class="btn-outline" id="btn-prev">← 이전</button>
      <button type="button" class="btn-outline" id="btn-next" style="background:var(--primary);color:var(--primary-foreground);border-color:var(--primary);">다음 →</button>
    </div>`;

  const stepLabel = root.querySelector("#step-label");
  const progBar = root.querySelector("#prog-bar");
  const progWrap = root.querySelector("#prog-wrap");
  const instruction = root.querySelector("#instruction");
  const hintEl = root.querySelector("#hint");
  const phoneSlot = root.querySelector("#phone-slot");
  const btnPrev = root.querySelector("#btn-prev");
  const btnNext = root.querySelector("#btn-next");

  function goTo(n) {
    step = n;
    // fire-and-forget: 실패해도 학습 흐름(화면 전환)을 막지 않는다 (API.md 5번).
    api.patch(`/progress/${encodeURIComponent(chapterId)}/`, { last_step: n }).catch(() => {});
    hint = false;
    render();
  }

  function advance() {
    if (step + 1 >= total) {
      location.href = `complete.html?chapter=${encodeURIComponent(chapterId)}`;
    } else {
      goTo(step + 1);
    }
  }

  function wrongTap() {
    hint = true;
    hintEl.hidden = false;
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => {
      hint = false;
      hintEl.hidden = true;
    }, 2000);
  }

  function render() {
    const current = steps[step];
    const pct = Math.round(((step + 1) / total) * 100);
    stepLabel.textContent = `STEP ${step + 1} / ${total}`;
    progBar.style.width = `${pct}%`;
    progWrap.setAttribute("aria-valuenow", String(pct));
    progWrap.setAttribute("aria-label", `진행률 ${pct}%`);
    instruction.textContent = current.instruction;
    hintEl.hidden = !hint;

    // Wrap the current step's HTML in the phone frame.
    phoneSlot.innerHTML = `
      <div class="phone-wrap">
        <div class="phone" data-wrongtap>
          <div class="phone__status"><span>12:30</span><span aria-hidden="true">📶 🔋</span></div>
          <div class="phone__screen">${current.html}</div>
          <div class="phone__nav" aria-hidden="true"><span>|||</span><span class="dot"></span><span>◁</span></div>
        </div>
      </div>`;
    bindTaps(phoneSlot, advance, wrongTap);

    btnPrev.disabled = step === 0;
  }

  btnPrev.addEventListener("click", () => step > 0 && goTo(step - 1));
  btnNext.addEventListener("click", () => advance());

  render();
}

main();
