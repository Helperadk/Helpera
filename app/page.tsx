'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type Job = {
  id: string
  title: string
  category: string
  region_code: string
  price_dkk: number
}

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([])

  useEffect(() => {
    supabase
      .from('jobs')
      .select('id,title,category,region_code,price_dkk')
      .order('created_at', { ascending: false })
      .then(({ data }) => setJobs(data ?? []))
  }, [])

  return (
    <main style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h1>Helpera</h1>

      <p>
        Find og tilbyd hjælp i dit lokalområde.<br />
        Du kan kigge rundt uden at logge ind.
      </p>

      <hr />

      <h2>Opslag</h2>

      {jobs.length === 0 && <p>Ingen opslag endnu.</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {jobs.map(job => (
          <li key={job.id} style={{ marginBottom: 16 }}>
            <strong>{job.title}</strong><br />
            {job.category} • {job.region_code} • {job.price_dkk} kr.<br />
            <a href={`/jobs/${job.id}`}>Se opslag</a>
          </li>
        ))}
      </ul>
    </main>
  )
}
