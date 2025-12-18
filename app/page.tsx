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
      options: {
        emailRedirectTo: 'https://helpera.dk'
      }
    })

    if (error) {
      setStatus(error.message)
    } else {
      setStatus('Tjek din e-mail for login-link.')
    }
  }

  return (
    <main style={{ padding: 32, maxWidth: 520, margin: '0 auto' }}>
      <h1>Log ind</h1>
      <p>Log ind med e-mail. Ingen kode nødvendig.</p>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="email"
          placeholder="Din e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={handleLogin}>Send login-link</button>
      </div>

      {status && <p style={{ marginTop: 12 }}>{status}</p>}
    </main>
  )
}
