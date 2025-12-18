'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { getLang, t } from '../../lib/i18n'

const REGIONS = [
  { code: 'HOVEDSTADEN', da: 'Hovedstaden', en: 'Capital Region' },
  { code: 'SJAELLAND', da: 'Sjælland', en: 'Zealand' },
  { code: 'FYN', da: 'Fyn', en: 'Funen' },
  { code: 'SYDJYLLAND', da: 'Sydjylland', en: 'South Jutland' },
  { code: 'MIDTJYLLAND', da: 'Midtjylland', en: 'Central Jutland' },
  { code: 'NORDJYLLAND', da: 'Nordjylland', en: 'North Jutland' },
]

export default function PostJob() {
  const lang = getLang()
  const tr = t(lang)

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [regionCode, setRegionCode] = useState('HOVEDSTADEN')
  const [price, setPrice] = useState<number>(0)
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setStatus(null)
    const e = email.trim()
    if (!title.trim()) return setStatus(lang === 'da' ? 'Titel mangler.' : 'Title is required.')
    if (!category.trim()) return setStatus(lang === 'da' ? 'Kategori mangler.' : 'Category is required.')
    if (!e.includes('@')) return setStatus(lang === 'da' ? 'Ugyldig e-mail.' : 'Invalid email.')

    setSaving(true)
    const { error } = await supabase.from('jobs').insert({
      title: title.trim(),
      category: category.trim(),
      region_code: regionCode,
      price_dkk: Number(price) || 0,
      description: description.trim() || null,
      poster_email: e,
    })
    setSaving(false)

    if (error) setStatus('Fejl: ' + error.message)
    else {
      setStatus(tr.sent)
      setTitle('')
      setCategory('')
      setDescription('')
      setPrice(0)
    }
  }

  return (
    <main style={{ padding: 18, maxWidth: 800, margin: '0 auto' }}>
      <a href="/" style={{ textDecoration: 'none', fontWeight: 800 }}>← {lang === 'da' ? 'Tilbage' : 'Back'}</a>

      <h1 style={{ marginTop: 12 }}>{tr.post}</h1>

      <div style={{ display: 'grid', gap: 10 }}>
        <input style={{ padding: 12, borderRadius: 12, border: '1px solid rgba(0,0,0,0.10)' }}
          placeholder={lang === 'da' ? 'Titel (fx Hent pakke)' : 'Title (e.g. Pick up package)'}
          value={title} onChange={(e) => setTitle(e.target.value)} />

        <input style={{ padding: 12, borderRadius: 12, border: '1px solid rgba(0,0,0,0.10)' }}
          placeholder={lang === 'da' ? 'Kategori (fx Havearbejde)' : 'Category (e.g. Gardening)'}
          value={category} onChange={(e) => setCategory(e.target.value)} />

        <label style={{ fontSize: 12, fontWeight: 800, opacity: 0.75 }}>
          {tr.region}
          <select
            value={regionCode}
            onChange={(e) => setRegionCode(e.target.value)}
            style={{ width: '100%', marginTop: 6, padding: 12, borderRadius: 12, border: '1px solid rgba(0,0,0,0.10)', background: '#fff' }}
          >
            {REGIONS.map(r => (
              <option key={r.code} value={r.code}>
                {lang === 'da' ? r.da : r.en}
              </option>
            ))}
          </select>
        </label>

        <input style={{ padding: 12, borderRadius: 12, border: '1px solid rgba(0,0,0,0.10)' }}
          type="number" min={0}
          placeholder={lang === 'da' ? 'Pris i kr. (fx 200)' : 'Price in DKK (e.g. 200)'}
          value={price} onChange={(e) => setPrice(Number(e.target.value))} />

        <textarea style={{ padding: 12, borderRadius: 12, border: '1px solid rgba(0,0,0,0.10)', minHeight: 140 }}
          placeholder={lang === 'da' ? 'Beskrivelse…' : 'Description…'}
          value={description} onChange={(e) => setDescription(e.target.value)} />

        <input style={{ padding: 12, borderRadius: 12, border: '1px solid rgba(0,0,0,0.10)' }}
          placeholder={tr.email}
          value={email} onChange={(e) => setEmail(e.target.value)} />

        <button
          onClick={save}
          disabled={saving}
          style={{ padding: 12, borderRadius: 12, border: '1px solid rgba(0,0,0,0.10)', background: '#111827', color: '#fff', fontWeight: 900 }}
        >
          {saving ? (lang === 'da' ? 'Gemmer…' : 'Saving…') : (lang === 'da' ? 'Opret opslag' : 'Create job')}
        </button>

        {status && <p>{status}</p>}
      </div>
    </main>
  )
}
