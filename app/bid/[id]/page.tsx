'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'
import { getLang } from '../../../lib/i18n'

export default function BidPage() {
  const { id } = useParams<{ id: string }>()
  const lang = getLang()

  const [title, setTitle] = useState<string>('')
  const [email, setEmail] = useState('')
  const [offer, setOffer] = useState<number>(0)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('jobs').select('title').eq('id', id).single().then(({ data }) => {
      setTitle((data as any)?.title ?? '')
    })
  }, [id])

  const send = async () => {
    setStatus(null)
    const e = email.trim()
    if (!e.includes('@')) return setStatus(lang === 'da' ? 'Ugyldig e-mail.' : 'Invalid email.')
    if ((Number(offer) || 0) <= 0) return setStatus(lang === 'da' ? 'Skriv et bud (kr.).' : 'Enter an offer (DKK).')

    setSaving(true)
    const { error } = await supabase.from('bids').insert({
      job_id: id,
      bidder_email: e,
      offer_dkk: Number(offer) || 0,
      message: message.trim() || null,
    })
    setSaving(false)

    if (error) setStatus('Fejl: ' + error.message)
    else {
      setStatus(lang === 'da' ? 'Bud sendt!' : 'Offer sent!')
      setMessage('')
      setOffer(0)
    }
  }

  return (
    <main style={{ padding: 18, maxWidth: 800, margin: '0 auto' }}>
      <a href={`/jobs/${id}`} style={{ textDecoration: 'none', fontWeight: 800 }}>
        ← {lang === 'da' ? 'Tilbage til opslag' : 'Back to job'}
      </a>

      <h1 style={{ marginTop: 12 }}>
        {lang === 'da' ? 'Byd på opgave' : 'Make an offer'}
      </h1>
      {title ? <p style={{ opacity: 0.8 }}>{title}</p> : null}

      <div style={{ display: 'grid', gap: 10 }}>
        <input
          style={{ padding: 12, borderRadius: 12, border: '1px solid rgba(0,0,0,0.10)' }}
          placeholder={lang === 'da' ? 'Din e-mail' : 'Your email'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={{ padding: 12, borderRadius: 12, border: '1px solid rgba(0,0,0,0.10)' }}
          type="number"
          min={0}
          placeholder={lang === 'da' ? 'Dit bud i kr. (fx 250)' : 'Your offer in DKK (e.g. 250)'}
          value={offer}
          onChange={(e) => setOffer(Number(e.target.value))}
        />

        <textarea
          style={{ padding: 12, borderRadius: 12, border: '1px solid rgba(0,0,0,0.10)', minHeight: 140 }}
          placeholder={lang === 'da' ? 'Besked (valgfrit)…' : 'Message (optional)…'}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={send}
          disabled={saving}
          style={{ padding: 12, borderRadius: 12, border: '1px solid rgba(0,0,0,0.10)', background: '#111827', color: '#fff', fontWeight: 900 }}
        >
          {saving ? (lang === 'da' ? 'Sender…' : 'Sending…') : (lang === 'da' ? 'Send bud' : 'Send offer')}
        </button>

        {status && <p>{status}</p>}
      </div>
    </main>
  )
}
