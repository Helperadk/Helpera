"use client";
import type { Lang } from "@/lib/i18n";

const KEY = "helpera_lang";

export function getLang(): Lang {
  if (typeof window === "undefined") return "da";
  const v = window.localStorage.getItem(KEY);
  return v === "en" ? "en" : "da";
}

export function setLang(lang: Lang) {
  window.localStorage.setItem(KEY, lang);
}

export function toggleLang(current: Lang): Lang {
  const next = current === "da" ? "en" : "da";
  setLang(next);
  return next;
}
