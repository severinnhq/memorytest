'use client'

import { useEffect } from 'react'

export default function GlobalScript() {
  useEffect(() => {
    // Add any global JavaScript here
    console.log('Global script loaded')
  }, [])

  return null
}