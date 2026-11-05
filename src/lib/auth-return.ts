"use client";

const key = "gwiteem_auth_return";

export function rememberAuthReturn() {
  try {
    const next = new URLSearchParams(window.location.search).get("next");
    if (next === "/questions/new") sessionStorage.setItem(key, next);
    else sessionStorage.removeItem(key);
  } catch {
    /* 저장소 사용이 제한되면 기본 메인으로 이동한다. */
  }
}

export function consumeAuthReturn() {
  try {
    const next = sessionStorage.getItem(key);
    sessionStorage.removeItem(key);
    return next === "/questions/new" ? next : "/";
  } catch {
    return "/";
  }
}
