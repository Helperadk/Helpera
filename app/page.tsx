'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  const handleLogin = async () => {
    setStatus(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: 'https://helpera.dk' },
    })

    if (error) setStatus(error.message)
    else setStatus('Tjek din e-mail for login-link.')
  }

  return (
    <main style={{ padding: 32, maxWidth: 520, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 8 }}>Helpera</h1>
      <p style={{ marginTop: 0 }}>
        Log ind med e-mail. Ingen kodeord.
      </p>

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <input
          type="email"
          placeholder="Din e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ flex: 1, padding: 10 }}
        />
        <button onClick={handleLogin} disabled={!email.includes('@')} style={{ padding: 10 }}>
          Log ind
        </button>
      </div>

      {status ? <p style={{ marginTop: 12 }}>{status}</p> : null}
    </main>
  )
}
