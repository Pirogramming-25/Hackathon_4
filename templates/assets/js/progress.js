const KEY = "smart-hangeoleum-progress";

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { completed: [], last: null };
}

function write(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {}
}

export function getCompleted() {
  return read().completed;
}

export function markComplete(chapterId) {
  const data = read();
  if (!data.completed.includes(chapterId)) data.completed.push(chapterId);
  write(data);
}

export function getLast() {
  return read().last;
}

export function saveLast(chapterId, step) {
  const data = read();
  data.last = { chapterId, step };
  write(data);
}

export function clearLast() {
  const data = read();
  data.last = null;
  write(data);
}
