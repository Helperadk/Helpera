'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    // Hent nuværende session ved load
    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user?.email ?? null)
    })

    // Lyt på ændringer i login/logout
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null)
    })

    return () => {
      sub.subscription.unsubscribe()
    }
  }, [])

  const handleLogin = async () => {
    setStatus(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: 'https://helpera.dk' },
    })

    setStatus(error ? error.message : 'Tjek din e-mail for login-link.')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setStatus('Du er logget ud.')
  }

  return (
    <main style={{ padding: 32, maxWidth: 520, margin: '0 auto' }}>
      <h1>Helpera</h1>

      {userEmail ? (
        <>
          <p>
            Logget ind som: <strong>{userEmail}</strong>
          </p>
          <button onClick={handleLogout}>Log ud</button>
        </>
      ) : (
        <>
          <p>Log ind med e-mail. Ingen kode nødvendig.</p>

          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="email"
              placeholder="Din e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ flex: 1, padding: 8 }}
            />
            <button onClick={handleLogin} disabled={!email.includes('@')}>
              Send login-link
            </button>
          </div>
        </>
      )}

      {status && <p style={{ marginTop: 12 }}>{status}</p>}
    </main>
  )
}
