const KEY = "smart-hangeoleum-settings";

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { lt: false, hc: false };
}

function write(s) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
}

let state = { lt: false, hc: false };

export function initSettings() {
  state = read();
  apply();
}

function apply() {
  const root = document.documentElement;
  root.classList.toggle("lt", !!state.lt);
  root.classList.toggle("hc", !!state.hc);
  write(state);
  syncButtons();
}

function syncButtons() {
  document.querySelectorAll("[data-a11y='lt']").forEach((b) => {
    b.setAttribute("aria-pressed", String(state.lt));
  });
  document.querySelectorAll("[data-a11y='hc']").forEach((b) => {
    b.setAttribute("aria-pressed", String(state.hc));
  });
}

export function bindA11yControls() {
  document.querySelectorAll("[data-a11y='lt']").forEach((b) => {
    b.addEventListener("click", () => {
      state.lt = !state.lt;
      apply();
    });
  });
  document.querySelectorAll("[data-a11y='hc']").forEach((b) => {
    b.addEventListener("click", () => {
      state.hc = !state.hc;
      apply();
    });
  });
  syncButtons();
}

export function a11yMarkup() {
  return `
    <div class="a11y">
      <button type="button" data-a11y="lt" aria-pressed="false">
        <span aria-hidden="true">🔠</span> 글자 크게
      </button>
      <button type="button" data-a11y="hc" aria-pressed="false">
        <span aria-hidden="true">🌓</span> 고대비 모드
      </button>
    </div>`;
}
