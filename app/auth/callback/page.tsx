'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      const url = new URL(window.location.href)
      const code = url.searchParams.get('code')

      if (code) {
        // Byt code til session
        await supabase.auth.exchangeCodeForSession(code)
      }

      // Send brugeren til forsiden efter login
      router.replace('/')
    }

    run()
  }, [router])

  return <p style={{ padding: 24 }}>Logger ind…</p>
}
