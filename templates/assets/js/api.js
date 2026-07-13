const BASE = "/api";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

async function apiGet(path) {
  const res = await fetch(`${BASE}${path}`, { credentials: "include" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "오류가 발생했어요." }));
    throw new Error(err.detail);
  }
  return res.status === 204 ? null : res.json();
}

async function apiSend(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "오류가 발생했어요." }));
    throw new Error(err.detail);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  get: apiGet,
  patch: (path, body) => apiSend("PATCH", path, body),
  post: (path, body) => apiSend("POST", path, body),
};
