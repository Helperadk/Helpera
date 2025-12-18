'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()
  const [msg, setMsg] = useState('Logger ind…')

  useEffect(() => {
    const run = async () => {
      try {
        const url = new URL(window.location.href)

        // Variant A: PKCE / ?code=...
        const code = url.searchParams.get('code')
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) {
            setMsg('Login-fejl (code): ' + error.message)
            return
          }
          router.replace('/')
          return
        }

        // Variant B: implicit / #access_token=...&refresh_token=...
        const hash = window.location.hash.startsWith('#')
          ? window.location.hash.slice(1)
          : window.location.hash

        if (hash) {
          const params = new URLSearchParams(hash)
          const access_token = params.get('access_token')
          const refresh_token = params.get('refresh_token')

          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({ access_token, refresh_token })
            if (error) {
              setMsg('Login-fejl (token): ' + error.message)
              return
            }
            router.replace('/')
            return
          }
        }

        // Hvis vi ender her, kom vi tilbage uden noget brugbart
        setMsg('Ingen login-data i linket. Prøv at sende magic link igen.')
      } catch (e: any) {
        setMsg('Uventet fejl: ' + (e?.message ?? String(e)))
      }
    }

    run()
  }, [router])

  return (
    <main style={{ padding: 24 }}>
      <h1>Helpera</h1>
      <p>{msg}</p>
    </main>
  )
}
