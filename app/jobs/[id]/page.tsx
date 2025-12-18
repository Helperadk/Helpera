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

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()

  const [job, setJob] = useState<Job | null>(null)
  const [regionName, setRegionName] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<string | null>(null)

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

      const jobData = j.data as Job
      setJob(jobData)

      const r = await supabase
        .from('regions')
        .select('name_da')
        .eq('code', jobData.region_code)
        .single()

      setRegionName(r.data?.name_da ?? jobData.region_code)
      setLoading(false)
    }

    if (id) load()
  }, [id])

  const sendContact = async () => {
    setStatus(null)

    const cleanEmail = email.trim()
    const cleanMsg = message.trim()

    if (!job) return
    if (!cleanEmail.includes('@')) {
      setStatus('Skriv en gyldig e-mail.')
      return
    }
    if (cleanMsg.length < 10) {
      setStatus('Beskeden skal være mindst 10 tegn.')
      return
    }

    const { error } = await supabase.from('contact_requests').insert({
      job_id: job.id,
      sender_email: cleanEmail,
      message: cleanMsg,
    })

    if (error) setStatus(`Fejl: ${error.message}`)
    else {
      setStatus('Sendt! (MVP: beskeden er gemt, så ejer kan kontaktes senere)')
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
    <main style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <a href="/" style={{ display: 'inline-block', marginBottom: 12 }}>← Tilbage</a>

      <h1>{job.title}</h1>
      <p style={{ opacity: 0.8 }}>
        {job.category} • {regionName} • {job.price_dkk} kr.
      </p>

      {job.description ? <p style={{ marginTop: 12 }}>{job.description}</p> : null}

      <hr style={{ margin: '20px 0' }} />

      <h2>Kontakt</h2>
      <p>Skriv din e-mail og en besked. (Ingen login endnu)</p>

      <div style={{ display: 'grid', gap: 10 }}>
        <input
          type="email"
          placeholder="Din e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 10 }}
        />

        <textarea
          placeholder="Skriv din besked…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ padding: 10, minHeight: 140 }}
        />

        <button onClick={sendContact}>
          Send besked
        </button>

        {status ? <p>{status}</p> : null}
      </div>
    </main>
  )
}
