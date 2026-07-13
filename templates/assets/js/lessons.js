import { homeScreen, appBar, doneScreen } from "./phone.js";

// Each chapter is an array of { instruction, html } — html contains a
// [data-tap="correct"] element for the correct answer target.

const row = (emoji, text, sub) =>
  `<div class="phone-row"><span aria-hidden="true">${emoji}</span><span>${text}${sub ? `<span class="sub">${sub}</span>` : ""}</span></div>`;

const keypad = () => {
  const keys = ["1","2","3","4","5","6","7","8","9","*","0","#"];
  return `<div class="keypad">${keys.map((k) => `<span>${k}</span>`).join("")}</div>`;
};

const field = (label, value, placeholder, opts = {}) => {
  const cls = "field" + (opts.soft ? " field--soft" : "");
  const vcls = "field__value" + (value ? "" : " field__value--empty");
  return `<div class="${cls}"><p class="field__label">${label}</p><p class="${vcls}">${value ?? placeholder}</p></div>`;
};

const tap = (inner, label, cls = "tap-target") =>
  `<button type="button" class="${cls}" data-tap="correct" aria-label="${label}">${inner}</button>`;

/* ---------- 📞 전화 ---------- */
const callSteps = [
  {
    instruction: "초록색 전화 앱을 눌러보세요.",
    html: homeScreen("phone"),
  },
  {
    instruction: "숫자 버튼(키패드)을 눌러 전화번호를 입력해보세요.",
    html: `
      ${appBar("전화")}
      <div class="flex flex-1 flex-col justify-end gap-4 px-6 pb-6">
        <p class="text-center" style="font-size:1.25rem;letter-spacing:.1em;color:var(--phone-muted);">번호를 입력하세요</p>
        ${tap(keypad(), "키패드", "tap-target tap-target--block")}
        <span class="call-btn call-btn--dim">📞</span>
      </div>`,
  },
  {
    instruction: "번호가 입력되었어요. 초록색 통화 버튼을 눌러보세요.",
    html: `
      ${appBar("전화")}
      <div class="flex flex-1 flex-col justify-end gap-4 px-6 pb-6">
        <p class="text-center font-bold" style="font-size:1.5rem;letter-spacing:.1em;color:var(--phone-fg);">010-1234-5678</p>
        ${keypad()}
        ${tap("📞", "통화 걸기", "tap-target call-btn")}
      </div>`,
  },
  {
    instruction: "전화가 연결됐어요! 통화가 끝나면 빨간 버튼을 눌러 끊어보세요.",
    html: `
      <div class="flex flex-1 flex-col items-center justify-between" style="padding:2.5rem 0;">
        <div class="text-center">
          <span class="hero-emoji" aria-hidden="true">👵</span>
          <p class="mt-3 font-bold" style="font-size:1.25rem;color:var(--phone-fg);">김영희</p>
          <p class="mt-2" style="font-size:.875rem;color:var(--call);">통화 중 00:12</p>
        </div>
        ${tap('<span>📞</span>', "통화 끊기", "tap-target hang-btn")}
      </div>`,
  },
  {
    instruction: "전화를 잘 걸고 끊으셨어요! 확인 버튼을 눌러 마무리해요.",
    html: doneScreen("전화 걸기 연습을 모두 마쳤어요!"),
  },
];

/* ---------- 👤 연락처 ---------- */
const contactsSteps = [
  {
    instruction: "연락처 앱을 눌러보세요.",
    html: homeScreen("contacts"),
  },
  {
    instruction: "새 연락처를 만들려면 주황색 ➕ 버튼을 눌러보세요.",
    html: `
      ${appBar("연락처")}
      <div class="relative flex-1">
        ${row("👴", "박철수")}
        ${row("👩", "이순자")}
        ${row("👨", "최민호")}
        ${tap("＋", "연락처 추가", "tap-target fab")}
      </div>`,
  },
  {
    instruction: "이름 입력란을 눌러보세요.",
    html: `
      ${appBar("연락처 추가")}
      <div class="flex flex-1 flex-col gap-3 px-4 pad-t">
        ${tap(field("이름", null, "이름을 입력하세요"), "이름 입력란", "tap-target tap-target--block")}
        ${field("전화번호", null, "번호를 입력하세요")}
      </div>`,
  },
  {
    instruction: "이름이 입력됐어요. 이번엔 전화번호 입력란을 눌러보세요.",
    html: `
      ${appBar("연락처 추가")}
      <div class="flex flex-1 flex-col gap-3 px-4 pad-t">
        ${field("이름", "김영희", "")}
        ${tap(field("전화번호", null, "번호를 입력하세요"), "전화번호 입력란", "tap-target tap-target--block")}
      </div>`,
  },
  {
    instruction: "모두 입력했어요. 아래 저장 버튼을 눌러보세요.",
    html: `
      ${appBar("연락처 추가")}
      <div class="flex flex-1 flex-col gap-3 px-4 pad-t">
        ${field("이름", "김영희", "")}
        ${field("전화번호", "010-1234-5678", "")}
        <div class="mt-auto pb-6">
          ${tap("저장", "저장", "tap-target w-full rounded-2xl")}
        </div>
      </div>
      <style>.done-screen__btn{}</style>`,
  },
  {
    instruction: "연락처가 저장됐어요! 확인 버튼을 눌러 마무리해요.",
    html: doneScreen("김영희 님이 연락처에 저장됐어요!"),
  },
];

// Give save button the call color styling (reusing done btn style would misalign).
// Add inline style rules for save button:
contactsSteps[4].html = contactsSteps[4].html.replace(
  '${tap("저장", "저장"',
  ""
);
// Redo step 4 properly (simpler):
contactsSteps[4] = {
  instruction: "모두 입력했어요. 아래 저장 버튼을 눌러보세요.",
  html: `
    ${appBar("연락처 추가")}
    <div class="flex flex-1 flex-col gap-3 px-4 pad-t">
      ${field("이름", "김영희", "")}
      ${field("전화번호", "010-1234-5678", "")}
      <div class="mt-auto pb-6">
        <button type="button" class="tap-target" data-tap="correct" aria-label="저장"
          style="width:100%;border-radius:1rem;background:var(--call);color:var(--call-foreground);padding:.75rem 0;font-size:1.125rem;font-weight:700;">저장</button>
      </div>
    </div>`,
};

/* ---------- 💬 문자 보내기 (9단계) ---------- */
const msgField = (label, value, placeholder) =>
  field(label, value, placeholder, { soft: true });

const messageSteps = [
  {
    instruction: "메시지 앱을 눌러보세요.",
    html: homeScreen("messages"),
  },
  {
    instruction: "새 메시지 작성 버튼을 눌러보세요.",
    html: `
      ${appBar("메시지")}
      <div class="relative flex-1">
        ${row("👴", "박철수", "내일 봅시다")}
        ${row("🏥", "보건소", "예약 안내드립니다")}
        ${tap("✏️", "새 메시지 작성", "tap-target fab")}
      </div>`,
  },
  {
    instruction: "받는 사람 입력란을 눌러보세요.",
    html: `
      ${appBar("새 메시지")}
      <div class="flex flex-1 flex-col gap-3 px-4 pad-t">
        ${tap(msgField("받는 사람", null, "이름이나 번호 입력"), "받는 사람 입력란", "tap-target tap-target--block")}
        ${msgField("메시지", null, "메시지를 입력하세요")}
      </div>`,
  },
  {
    instruction: "저장된 연락처에서 '김영희' 님을 눌러 선택해보세요.",
    html: `
      ${appBar("새 메시지")}
      <div class="flex flex-1 flex-col gap-3 px-4 pad-t">
        ${msgField("받는 사람", null, "이름이나 번호 입력")}
        <p style="padding:0 .25rem;font-size:.7rem;color:var(--phone-muted);">추천 연락처</p>
        <button type="button" class="tap-target" data-tap="correct" aria-label="김영희 선택"
          style="display:flex;align-items:center;gap:.75rem;border-radius:.75rem;border:1px solid var(--phone-line);padding:.75rem 1rem;text-align:left;">
          <span aria-hidden="true">👵</span>
          <span style="font-size:.875rem;color:var(--phone-fg);">김영희<span class="sub">010-1234-5678</span></span>
        </button>
      </div>`,
  },
  {
    instruction: "이번엔 메시지 입력란을 눌러보세요.",
    html: `
      ${appBar("새 메시지")}
      <div class="flex flex-1 flex-col gap-3 px-4 pad-t">
        ${msgField("받는 사람", "김영희", "")}
        ${tap(msgField("메시지", null, "메시지를 입력하세요"), "메시지 입력란", "tap-target tap-target--block")}
      </div>`,
  },
  {
    instruction: "자주 쓰는 문구 '안녕하세요!'를 눌러 입력해보세요.",
    html: `
      ${appBar("새 메시지")}
      <div class="flex flex-1 flex-col gap-3 px-4 pad-t">
        ${msgField("받는 사람", "김영희", "")}
        ${msgField("메시지", null, "메시지를 입력하세요")}
        <p style="padding:0 .25rem;font-size:.7rem;color:var(--phone-muted);">자주 쓰는 문구</p>
        <div style="display:flex;flex-wrap:wrap;gap:.5rem;">
          <button type="button" class="tap-target chip" data-tap="correct" aria-label="안녕하세요 문구 입력">안녕하세요!</button>
          <span class="chip chip--muted">감사합니다</span>
        </div>
      </div>`,
  },
  {
    instruction: "메시지가 완성됐어요. 보내기 버튼을 눌러보세요.",
    html: `
      ${appBar("새 메시지")}
      <div class="flex flex-1 flex-col gap-3 px-4 pad-t">
        ${msgField("받는 사람", "김영희", "")}
        ${msgField("메시지", "안녕하세요!", "")}
        <div class="mt-auto pb-6" style="display:flex;justify-content:flex-end;">
          <button type="button" class="tap-target" data-tap="correct" aria-label="보내기"
            style="display:flex;align-items:center;gap:.5rem;border-radius:999px;background:var(--call);color:var(--call-foreground);padding:.75rem 1.5rem;font-size:1rem;font-weight:700;">
            보내기 ➤
          </button>
        </div>
      </div>`,
  },
  {
    instruction: "전송 완료! 방금 보낸 말풍선을 눌러 확인해보세요.",
    html: `
      ${appBar("김영희")}
      <div class="flex flex-1 flex-col justify-end gap-2 px-4 pb-6">
        <div style="display:flex;justify-content:flex-end;">
          ${tap("안녕하세요!", "보낸 메시지 확인", "tap-target bubble")}
        </div>
        <p class="text-right" style="font-size:.65rem;color:var(--phone-muted);">전송됨 · 12:30</p>
      </div>`,
  },
  {
    instruction: "문자를 직접 보내셨어요! 확인 버튼을 눌러 마무리해요.",
    html: doneScreen("문자 보내기 연습을 모두 마쳤어요!"),
  },
];

/* ---------- 📷 사진 ---------- */
const photoSteps = [
  {
    instruction: "카메라 앱을 눌러보세요.",
    html: homeScreen("camera"),
  },
  {
    instruction: "가운데 하얀 촬영 버튼을 눌러 사진을 찍어보세요.",
    html: `
      <div class="camera-view">
        <div class="camera-view__frame" aria-hidden="true">🌷</div>
        <div class="camera-controls">
          <span class="thumb" aria-hidden="true"></span>
          ${tap('<span class="sr-only">촬영</span>', "사진 촬영", "tap-target shutter")}
          <span style="font-size:1.5rem;" aria-hidden="true">🔄</span>
        </div>
      </div>`,
  },
  {
    instruction: "찰칵! 왼쪽 아래 작은 사진(미리보기)을 눌러보세요.",
    html: `
      <div class="camera-view">
        <div class="camera-view__frame" aria-hidden="true">🌷</div>
        <div class="camera-controls">
          ${tap("🌷", "방금 찍은 사진 보기", "tap-target thumb thumb--live")}
          <span class="shutter" aria-hidden="true"></span>
          <span style="font-size:1.5rem;" aria-hidden="true">🔄</span>
        </div>
      </div>`,
  },
  {
    instruction: "사진이 잘 찍혔네요! 하트를 눌러 즐겨찾기에 추가해보세요.",
    html: `
      ${appBar("갤러리")}
      <div class="flex flex-1 flex-col items-center justify-center gap-6">
        <span aria-hidden="true"
          style="display:flex;align-items:center;justify-content:center;height:13rem;width:13rem;border-radius:1rem;background:oklch(0.92 0.005 80 / 0.5);font-size:4.5rem;">🌷</span>
        ${tap("🤍", "즐겨찾기 추가",
          "tap-target")}
      </div>
      <style></style>`,
  },
  {
    instruction: "사진 찍기를 배우셨어요! 확인 버튼을 눌러 마무리해요.",
    html: doneScreen("사진 찍고 확인하기를 모두 마쳤어요!"),
  },
];
// heart button styling override
photoSteps[3].html = `
  ${appBar("갤러리")}
  <div class="flex flex-1 flex-col items-center justify-center gap-6">
    <span aria-hidden="true"
      style="display:flex;align-items:center;justify-content:center;height:13rem;width:13rem;border-radius:1rem;background:oklch(0.92 0.005 80 / 0.5);font-size:4.5rem;">🌷</span>
    <button type="button" class="tap-target" data-tap="correct" aria-label="즐겨찾기 추가"
      style="display:flex;align-items:center;justify-content:center;height:3.5rem;width:3.5rem;border-radius:999px;background:oklch(0.92 0.005 80 / 0.6);font-size:1.5rem;">🤍</button>
  </div>`;

/* ---------- 📶 와이파이 ---------- */
const wifiSteps = [
  {
    instruction: "설정 앱을 눌러보세요.",
    html: homeScreen("settings"),
  },
  {
    instruction: "'연결' 메뉴를 눌러보세요.",
    html: `
      ${appBar("설정")}
      <div class="flex-1">
        <button type="button" class="tap-target tap-target--block" data-tap="correct" aria-label="연결 메뉴">
          ${row("📶", "연결", "Wi-Fi, 블루투스")}
        </button>
        ${row("🔊", "소리 및 진동")}
        ${row("🔆", "디스플레이")}
        ${row("🔋", "배터리")}
      </div>`,
  },
  {
    instruction: "'Wi-Fi'를 눌러보세요.",
    html: `
      ${appBar("연결")}
      <div class="flex-1">
        <button type="button" class="tap-target tap-target--block" data-tap="correct" aria-label="Wi-Fi 메뉴">
          ${row("📶", "Wi-Fi", "꺼짐")}
        </button>
        ${row("🎧", "블루투스")}
        ${row("✈️", "비행기 모드")}
      </div>`,
  },
  {
    instruction: "스위치를 눌러 와이파이를 켜보세요.",
    html: `
      ${appBar("Wi-Fi")}
      <div class="flex-1 px-4 pad-t">
        <div style="display:flex;align-items:center;justify-content:space-between;border-radius:.75rem;background:oklch(0.92 0.005 80 / 0.5);padding:.75rem 1rem;">
          <span style="font-size:.875rem;font-weight:600;color:var(--phone-fg);">Wi-Fi 사용</span>
          ${tap("", "와이파이 켜기", "tap-target toggle")}
        </div>
      </div>`,
  },
  {
    instruction: "우리집 와이파이 이름을 눌러 연결해보세요.",
    html: `
      ${appBar("Wi-Fi")}
      <div class="flex-1 px-4 pad-t">
        <div style="display:flex;align-items:center;justify-content:space-between;border-radius:.75rem;background:oklch(0.92 0.005 80 / 0.5);padding:.75rem 1rem;margin-bottom:.75rem;">
          <span style="font-size:.875rem;font-weight:600;color:var(--phone-fg);">Wi-Fi 사용</span>
          <span class="toggle toggle--on" aria-hidden="true"></span>
        </div>
        <p style="padding:0 .25rem .5rem;font-size:.7rem;color:var(--phone-muted);">사용 가능한 네트워크</p>
        <button type="button" class="tap-target" data-tap="correct" aria-label="우리집 와이파이 연결"
          style="display:flex;width:100%;align-items:center;gap:.75rem;border-radius:.75rem;border:1px solid var(--phone-line);padding:.75rem 1rem;text-align:left;">
          <span aria-hidden="true">📶</span>
          <span style="font-size:.875rem;color:var(--phone-fg);">우리집_와이파이</span>
        </button>
        <div style="display:flex;align-items:center;gap:.75rem;border-radius:.75rem;padding:.75rem 1rem;opacity:.5;margin-top:.5rem;">
          <span aria-hidden="true">📶</span>
          <span style="font-size:.875rem;color:var(--phone-muted);">이웃집_5G</span>
        </div>
      </div>`,
  },
  {
    instruction: "와이파이가 연결됐어요! 확인 버튼을 눌러 마무리해요.",
    html: doneScreen("우리집 와이파이에 연결됐어요!"),
  },
];

/* ---------- 🔍 인터넷 검색 ---------- */
const searchSteps = [
  {
    instruction: "인터넷 앱을 눌러보세요.",
    html: homeScreen("internet"),
  },
  {
    instruction: "위쪽 검색창을 눌러보세요.",
    html: `
      <div class="flex flex-1 flex-col px-4 pad-t">
        <button type="button" class="tap-target searchbar searchbar--tap" data-tap="correct" aria-label="검색창">
          <span aria-hidden="true">🔍</span>
          <span style="color:var(--phone-muted);">검색어를 입력하세요</span>
        </button>
        <div class="flex flex-1 items-center justify-center" style="font-size:3rem;" aria-hidden="true">🌐</div>
      </div>`,
  },
  {
    instruction: "추천 검색어 '오늘 날씨'를 눌러보세요.",
    html: `
      <div class="flex flex-1 flex-col px-4 pad-t">
        <div class="searchbar"><span aria-hidden="true">🔍</span><span style="color:var(--phone-fg);">|</span></div>
        <p style="padding:1rem .5rem 0;font-size:.7rem;color:var(--phone-muted);">추천 검색어</p>
        <button type="button" class="tap-target" data-tap="correct" aria-label="오늘 날씨 검색어 선택"
          style="margin-top:.5rem;display:flex;width:100%;align-items:center;gap:.75rem;border-radius:.75rem;padding:.75rem;text-align:left;">
          <span aria-hidden="true">🔍</span>
          <span style="font-size:.875rem;color:var(--phone-fg);">오늘 날씨</span>
        </button>
        <div style="display:flex;align-items:center;gap:.75rem;padding:.75rem;opacity:.6;">
          <span aria-hidden="true">🔍</span>
          <span style="font-size:.875rem;color:var(--phone-muted);">버스 시간표</span>
        </div>
      </div>`,
  },
  {
    instruction: "검색 버튼을 눌러보세요.",
    html: `
      <div class="flex flex-1 flex-col px-4 pad-t">
        <div class="searchbar"><span aria-hidden="true">🔍</span><span style="color:var(--phone-fg);">오늘 날씨</span></div>
        <div class="mt-auto" style="padding-bottom:2rem;">
          <button type="button" class="tap-target" data-tap="correct" aria-label="검색"
            style="width:100%;border-radius:1rem;background:var(--call);color:var(--call-foreground);padding:.75rem 0;font-size:1.125rem;font-weight:700;">🔍 검색</button>
        </div>
      </div>`,
  },
  {
    instruction: "검색 결과가 나왔어요. 맨 위 '오늘의 날씨'를 눌러보세요.",
    html: `
      <div class="flex flex-1 flex-col px-4 pad-t">
        <div class="searchbar" style="padding:.5rem 1rem;"><span aria-hidden="true">🔍</span><span style="color:var(--phone-fg);">오늘 날씨</span></div>
        <button type="button" class="tap-target result" data-tap="correct" aria-label="오늘의 날씨 결과 열기" style="margin-top:1rem;">
          <strong>☀️ 오늘의 날씨 — 맑음, 23도</strong>
          <span>기상청 날씨 정보</span>
        </button>
        <div class="result" style="margin-top:.75rem;opacity:.6;">
          <span style="color:var(--phone-muted);">주간 날씨 예보</span>
        </div>
      </div>`,
  },
  {
    instruction: "날씨를 직접 검색하셨어요! 확인 버튼을 눌러 마무리해요.",
    html: doneScreen("인터넷 검색을 모두 마쳤어요!"),
  },
];

export const lessons = {
  call: callSteps,
  contacts: contactsSteps,
  message: messageSteps,
  photo: photoSteps,
  wifi: wifiSteps,
  search: searchSteps,
};
