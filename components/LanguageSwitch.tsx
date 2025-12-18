"use client";

import { useEffect, useState } from "react";
import { i18n, type Lang } from "@/lib/i18n";
import { getLang, toggleLang } from "@/lib/lang";

export function LanguageSwitch() {
  const [lang, setLangState] = useState<Lang>("da");

  useEffect(() => {
    setLangState(getLang());
  }, []);

  return (
    <button
      className="btn btn-ghost"
      onClick={() => setLangState(toggleLang(lang))}
      aria-label={i18n[lang].common.languageSwitch}
      type="button"
    >
      {i18n[lang].common.languageSwitch}
    </button>
  );
}
