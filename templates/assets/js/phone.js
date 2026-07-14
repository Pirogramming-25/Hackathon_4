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
      <span class="phone__time">12:30</span>
      <span class="camera-cutout"></span>
      <span class="status-icons" aria-hidden="true">
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <path d="M8.5 10.2C9.16274 10.2 9.7 9.66274 9.7 9C9.7 8.33726 9.16274 7.8 8.5 7.8C7.83726 7.8 7.3 8.33726 7.3 9C7.3 9.66274 7.83726 10.2 8.5 10.2Z" fill="currentColor"/>
          <path d="M5.6 6.5C6.4 5.7 7.4 5.3 8.5 5.3C9.6 5.3 10.6 5.7 11.4 6.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          <path d="M3 3.9C4.7 2.3 6.5 1.5 8.5 1.5C10.5 1.5 12.3 2.3 14 3.9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          <rect x="0" y="8" width="3" height="4" fill="currentColor"/>
          <rect x="5" y="6" width="3" height="6" fill="currentColor"/>
          <rect x="10" y="3" width="3" height="9" fill="currentColor"/>
          <rect x="15" y="0" width="3" height="12" fill="currentColor"/>
        </svg>
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
          <rect x="0.5" y="0.5" width="20" height="11" rx="2.5" stroke="currentColor"/>
          <rect x="2" y="2" width="17" height="8" rx="1.3" fill="currentColor"/>
          <rect x="21.5" y="4" width="2" height="4" rx="1" fill="currentColor"/>
        </svg>
      </span>
    </div>`;
}

export function navBar() {
  return `<div class="phone__nav" aria-hidden="true"></div>`;
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
