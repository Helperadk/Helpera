'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'

type Job = {
  id: string
  title: string
  category: string
  region_code: string
  price_dkk: number
  description: string | null
  created_at: string
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f7f7fb' },
  main: { maxWidth: 900, margin: '0 auto', padding: 18 },
  topbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  back: {
    textDecoration: 'none',
    color: '#111827',
    fontWeight: 800,
    padding: '10px 12px',
    borderRadius: 12,
    border: '1px solid rgba(0,0,0,0.08)',
    background: '#fff',
  },
  card: {
    border: '1px solid rgba(0,0,0,0.06)',
    background: '#fff',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 10px 30px rgba(16, 24, 40, 0.06)',
  },
  title: { margin: 0, fontSize: 20, fontWeight: 900, letterSpacing: -0.2 },
  metaRow: { marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' },
  pill: {
    fontSize: 12,
    padding: '8px 10px',
    borderRadius: 999,
    border: '1px solid rgba(0,0,0,0.08)',
    background: '#fff',
    opacity: 0.9,
  },
  price: {
    fontSize: 13,
    padding: '8px 10px',
    borderRadius: 12,
    background: '#f3f4ff',
    border: '1px solid rgba(66, 65, 255, 0.18)',
    fontWeight: 900,
  },
  desc: { marginTop: 12, lineHeight: 1.55, opacity: 0.9 },

  grid: { display: 'grid', gap: 12, marginTop: 12 },
  label: { fontSize: 12, fontWeight: 800, opacity: 0.75 },
  input: {
    width: '100%',
    padding: 12,
    borderRadius: 12,
    border: '1px solid rgba(0,0,0,0.10)',
    outline: 'none',
    background: '#fff',
  },
  textarea: {
    width: '100%',
    padding: 12,
    borderRadius: 12,
    border: '1px solid rgba(0,0,0,0.10)',
    outline: 'none',
    background: '#fff',
    minHeight: 140,
    resize: 'vertical',
  },
  btn: {
    appearance: 'none',
    border: '1px solid rgba(0,0,0,0.08)',
    background: '#111827',
    color: '#fff',
    padding: '12px 12px',
    borderRadius: 12,
    fontWeight: 800,
  },
  note: { fontSize: 12, opacity: 0.7, marginTop: 8 },
  status: { marginTop: 10, fontSize: 13 },
}

function regionDa(code: string) {
  const map: Record<string, string> = {
    HOVEDSTADEN: 'Hovedstaden',
    SJAELLAND: 'Sjælland',
    FYN: 'Fyn',
    SYDJYLLAND: 'Sydjylland',
    MIDTJYLLAND: 'Midtjylland',
    NORDJYLLAND: 'Nordjylland',
  }
  return map[code] ?? code
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()

  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)

      const j = await supabase
        .from('jobs')
        .select('id,title,category,region_code,price_dkk,description,created_at')
        .eq('id', id)
        .single()

      if (j.error) {
        setError(j.error.message)
        setLoading(false)
        return
      }

      setJob(j.data as Job)
      setLoading(false)
    }

    if (id) load()
  }, [id])

  const sendContact = async () => {
    setStatus(null)
    const cleanEmail = email.trim()
    const cleanMsg = message.trim()

    if (!job) return
    if (!cleanEmail.includes('@')) return setStatus('Skriv en gyldig e-mail.')
    if (cleanMsg.length < 10) return setStatus('Beskeden skal være mindst 10 tegn.')

    setSending(true)

    const { error } = await supabase.from('contact_requests').insert({
      job_id: job.id,
      sender_email: cleanEmail,
      message: cleanMsg,
    })

    setSending(false)

    if (error) setStatus(`Fejl: ${error.message}`)
    else {
      setStatus('Sendt! Vi har modtaget din besked.')
      setMessage('')
    }
  }

  if (loading) return <main style={{ padding: 24 }}>Indlæser…</main>

  if (error) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Fejl</h1>
        <p>{error}</p>
      </main>
    )
  }

  if (!job) return <main style={{ padding: 24 }}>Opslag ikke fundet.</main>

  return (
    <div style={s.page}>
      <main style={s.main}>
        <div style={s.topbar}>
          <a href="/" style={s.back}>← Tilbage</a>
          <span style={{ fontSize: 12, opacity: 0.7 }}>Helpera</span>
        </div>

        <section style={s.card}>
          <h1 style={s.title}>{job.title}</h1>

          <div style={s.metaRow}>
            <span style={s.pill}>🧰 {job.category}</span>
            <span style={s.pill}>📍 {regionDa(job.region_code)}</span>
            <span style={s.price}>💰 {job.price_dkk} kr.</span>
          </div>

          {job.description ? <p style={s.desc}>{job.description}</p> : null}
        </section>

        <section style={{ ...s.card, marginTop: 12 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 900 }}>Kontakt</h2>
          <p style={{ marginTop: 8, opacity: 0.8 }}>
            Skriv din e-mail og en besked. (MVP – login kommer senere)
          </p>

          <div style={s.grid}>
            <div>
              <div style={s.label}>Din e-mail</div>
              <input
                style={s.input}
                type="email"
                placeholder="navn@mail.dk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div style={s.label}>Besked</div>
              <textarea
                style={s.textarea}
                placeholder="Hej! Jeg kan hjælpe med…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div style={s.note}>Minimum 10 tegn.</div>
            </div>

            <button style={s.btn} onClick={sendContact} disabled={sending}>
              {sending ? 'Sender…' : 'Send besked'}
            </button>

            {status && <div style={s.status}>{status}</div>}
          </div>
        </section>
      </main>
    </div>
  )
}
