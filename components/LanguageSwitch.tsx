'use client'

import { useEffect, useState } from 'react'
import { getLang, setLang, Lang } from '../lib/i18n'

export default function LanguageSwitch() {
  const [lang, setLocalLang] = useState<Lang>('da')

  useEffect(() => {
    setLocalLang(getLang())
  }, [])

  const toggle = () => {
    const next: Lang = lang === 'da' ? 'en' : 'da'
    setLang(next)
    setLocalLang(next)
    // Hurtigst: reload for at opdatere tekster overalt uden ekstra state-halløj
    window.location.reload()
  }

  return (
    <button
      onClick={toggle}
      style={{
        border: '1px solid rgba(0,0,0,0.08)',
        background: '#fff',
        padding: '10px 12px',
        borderRadius: 12,
        fontWeight: 800,
      }}
    >
      {lang === 'da' ? 'DA' : 'EN'}
    </button>
  )
}
