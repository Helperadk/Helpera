'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type Job = {
  id: string
  title: string
  category: string
  region_code: string
  price_dkk: number
  created_at?: string
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f7f7fb' },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    background: 'rgba(247,247,251,0.9)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
  },
  headerInner: {
    maxWidth: 980,
    margin: '0 auto',
    padding: '16px 18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  brand: { display: 'flex', flexDirection: 'column', gap: 2 },
  logo: { fontSize: 22, fontWeight: 800, letterSpacing: -0.3, margin: 0 },
  tagline: { margin: 0, fontSize: 12, opacity: 0.75 },

  main: { maxWidth: 980, margin: '0 auto', padding: '18px' },

  hero: {
    border: '1px solid rgba(0,0,0,0.06)',
    background: '#fff',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 10px 30px rgba(16, 24, 40, 0.06)',
  },
  heroTop: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
  },
  heroTitle: { margin: 0, fontSize: 18, fontWeight: 800, letterSpacing: -0.2 },
  heroText: { margin: '8px 0 0', opacity: 0.8, lineHeight: 1.5 },

  chipRow: { display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 10px',
    borderRadius: 999,
    border: '1px solid rgba(0,0,0,0.08)',
    background: '#fff',
    fontSize: 12,
  },

  grid: { display: 'grid', gap: 12, marginTop: 14 },
  card: {
    border: '1px solid rgba(0,0,0,0.06)',
    background: '#fff',
    borderRadius: 16,
    padding: 14,
    boxShadow: '0 10px 30px rgba(16, 24, 40, 0.06)',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  title: { margin: 0, fontSize: 16, fontWeight: 800, letterSpacing: -0.2 },
  meta: { marginTop: 6, opacity: 0.75, fontSize: 13 },
  price: {
    padding: '8px 10px',
    borderRadius: 12,
    background: '#f3f4ff',
    border: '1px solid rgba(66, 65, 255, 0.18)',
    fontWeight: 800,
    whiteSpace: 'nowrap',
  },
  actions: { display: 'flex', gap: 10, alignItems: 'center', marginTop: 10 },
  primaryBtn: {
    appearance: 'none',
    border: '1px solid rgba(0,0,0,0.08)',
    background: '#111827',
    color: '#fff',
    padding: '10px 12px',
    borderRadius: 12,
    fontWeight: 700,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtn: {
    appearance: 'none',
    border: '1px solid rgba(0,0,0,0.08)',
    background: '#fff',
    color: '#111827',
    padding: '10px 12px',
    borderRadius: 12,
    fontWeight: 700,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  small: { fontSize: 12, opacity: 0.7 },

  footerSpace: { height: 18 },
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

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState<'ALL' | string>('ALL')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('jobs')
        .select('id,title,category,region_code,price_dkk,created_at')
        .order('created_at', { ascending: false })

      setJobs((data as Job[]) ?? [])
      setLoading(false)
    }

    load()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return jobs.filter((j) => {
      const okRegion = region === 'ALL' ? true : j.region_code === region
      const okQuery =
        q.length === 0
          ? true
          : (j.title ?? '').toLowerCase().includes(q) ||
            (j.category ?? '').toLowerCase().includes(q) ||
            (j.region_code ?? '').toLowerCase().includes(q)
      return okRegion && okQuery
    })
  }, [jobs, query, region])

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.brand}>
            <h1 style={styles.logo}>Helpera</h1>
            <p style={styles.tagline}>Find og tilbyd hjælp – hurtigt og lokalt</p>
          </div>
          <a style={styles.secondaryBtn} href="#opslag">
            Se opslag
          </a>
        </div>
      </header>

      <main style={styles.main}>
        <section style={styles.hero}>
          <div style={styles.heroTop}>
            <div>
              <h2 style={styles.heroTitle}>Uden login: se opgaver i hele Danmark</h2>
              <p style={styles.heroText}>
                Du kan kigge og finde opgaver frit. Kontakt kræver ikke login i MVP’en endnu – vi
                gemmer din besked sikkert.
              </p>
            </div>

            <div style={{ minWidth: 260, flex: '1 1 260px' }}>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Søg: fx hund, have, pakke…"
                style={{
                  width: '100%',
                  padding: '12px 12px',
                  borderRadius: 12,
                  border: '1px solid rgba(0,0,0,0.10)',
                  outline: 'none',
                }}
              />
              <div style={styles.chipRow}>
                <span style={styles.chip}>📍 Danmark</span>
                <span style={styles.chip}>⚡ Hurtig kontakt</span>
                <span style={styles.chip}>🧰 Småjobs</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, opacity: 0.85 }}>
              Landsdel:
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                style={{
                  padding: '10px 10px',
                  borderRadius: 12,
                  border: '1px solid rgba(0,0,0,0.10)',
                  background: '#fff',
                }}
              >
                <option value="ALL">Alle</option>
                <option value="HOVEDSTADEN">Hovedstaden</option>
                <option value="SJAELLAND">Sjælland</option>
                <option value="FYN">Fyn</option>
                <option value="SYDJYLLAND">Sydjylland</option>
                <option value="MIDTJYLLAND">Midtjylland</option>
                <option value="NORDJYLLAND">Nordjylland</option>
              </select>
            </label>

            <span style={{ alignSelf: 'center', fontSize: 12, opacity: 0.7 }}>
              Tip: Klik på “Se opslag” for at åbne og kontakte.
            </span>
          </div>
        </section>

        <section id="opslag" style={{ marginTop: 14 }}>
          {loading ? (
            <div style={styles.card}>Indlæser opslag…</div>
          ) : filtered.length === 0 ? (
            <div style={styles.card}>
              <strong>Ingen opslag matcher.</strong>
              <p style={{ marginTop: 8, opacity: 0.8 }}>
                Prøv at ændre landsdel eller søg efter en anden kategori.
              </p>
            </div>
          ) : (
            <div style={styles.grid}>
              {filtered.map((job) => (
                <article key={job.id} style={styles.card}>
                  <div style={styles.cardTop}>
                    <div>
                      <h3 style={styles.title}>{job.title}</h3>
                      <div style={styles.meta}>
                        {job.category} • {regionDa(job.region_code)}
                      </div>
                    </div>
                    <div style={styles.price}>{job.price_dkk} kr.</div>
                  </div>

                  <div style={styles.actions}>
                    <a style={styles.primaryBtn} href={`/jobs/${job.id}`}>
                      Se opslag
                    </a>
                    <span style={styles.small}>Kontakt ligger inde på opslaget</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <div style={styles.footerSpace} />
      </main>
    </div>
  )
}
