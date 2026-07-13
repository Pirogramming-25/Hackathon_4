export const courses = [
  {
    id: "smartphone",
    emoji: "📱",
    name: "스마트폰 기초",
    desc: "전화, 문자, 사진까지 스마트폰의 기본을 하나씩 배워요.",
    chapters: [
      { id: "call", emoji: "📞", name: "전화", goal: "전화를 걸고 끊는 방법을 배워요.", minutes: 5 },
      { id: "contacts", emoji: "👤", name: "연락처 추가", goal: "가족과 친구의 번호를 저장해요.", minutes: 5 },
      { id: "message", emoji: "💬", name: "문자 보내기", goal: "안부 문자를 직접 보내봐요.", minutes: 7 },
      { id: "photo", emoji: "📷", name: "사진", goal: "사진을 찍고 확인하는 방법을 배워요.", minutes: 5 },
    ],
  },
  {
    id: "internet",
    emoji: "🌐",
    name: "인터넷 기초",
    desc: "와이파이 연결부터 궁금한 것 검색까지 배워요.",
    chapters: [
      { id: "wifi", emoji: "📶", name: "와이파이 연결", goal: "집에서 와이파이를 직접 연결해요.", minutes: 6 },
      { id: "search", emoji: "🔍", name: "인터넷 검색", goal: "오늘 날씨를 직접 검색해봐요.", minutes: 6 },
    ],
  },
];

export function findChapter(chapterId) {
  for (const course of courses) {
    const chapter = course.chapters.find((c) => c.id === chapterId);
    if (chapter) return { chapter, course };
  }
  return null;
}
