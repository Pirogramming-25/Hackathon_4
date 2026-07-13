// Phone simulator rendering helpers.
// All functions return HTML strings. After injecting, call `bindTaps(container, onCorrect)`
// to wire elements marked [data-tap="correct"] to onCorrect and treat everything else as wrong.

const APPS = [
  { id: "phone", emoji: "📞", name: "전화" },
  { id: "contacts", emoji: "👤", name: "연락처" },
  { id: "messages", emoji: "💬", name: "메시지" },
  { id: "camera", emoji: "📷", name: "카메라" },
  { id: "gallery", emoji: "🖼️", name: "갤러리" },
  { id: "settings", emoji: "⚙️", name: "설정" },
  { id: "internet", emoji: "🌐", name: "인터넷" },
  { id: "clock", emoji: "⏰", name: "시계" },
];

export function statusBar() {
  return `
    <div class="phone__status">
      <span>12:30</span>
      <span aria-hidden="true">📶 🔋</span>
    </div>`;
}

export function navBar() {
  return `
    <div class="phone__nav" aria-hidden="true">
      <span>|||</span>
      <span class="dot"></span>
      <span>◁</span>
    </div>`;
}

export function phoneFrame(innerHtml) {
  return `
    <div class="phone-wrap">
      <div class="phone" data-wrongtap>
        ${statusBar()}
        <div class="phone__screen">
          ${innerHtml}
        </div>
        ${navBar()}
      </div>
    </div>`;
}

export function homeScreen(targetApp) {
  const cells = APPS.map((app) => {
    const inner = `
      <span class="app-cell">
        <span class="app-cell__icon">${app.emoji}</span>
        <span class="app-cell__label">${app.name}</span>
      </span>`;
    if (app.id === targetApp) {
      return `<button type="button" class="tap-target" data-tap="correct" aria-label="${app.name} 앱 열기">${inner}</button>`;
    }
    return inner;
  }).join("");
  return `<div class="phone-wallpaper"><div class="app-grid">${cells}</div></div>`;
}

export function appBar(title) {
  return `<div class="app-bar">${title}</div>`;
}

export function doneScreen(message) {
  return `
    <div class="done-screen">
      <span class="hero-emoji" aria-hidden="true">👏</span>
      <p class="done-screen__msg">${message}</p>
      <button type="button" class="tap-target done-screen__btn" data-tap="correct" aria-label="확인">확인</button>
    </div>`;
}

// Wires clicks inside `root`:
// - element with [data-tap="correct"] (or an ancestor) → onCorrect()
// - any other click on the phone → onWrong()
export function bindTaps(root, onCorrect, onWrong) {
  const frame = root.querySelector("[data-wrongtap]");
  if (!frame) return;
  frame.addEventListener("click", (e) => {
    const target = e.target.closest("[data-tap='correct']");
    if (target && frame.contains(target)) {
      e.stopPropagation();
      onCorrect();
    } else {
      onWrong();
    }
  });
}
