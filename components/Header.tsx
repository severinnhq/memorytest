'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"

export default function Header() {
  const [user, setUser] = useState<{ name: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem('user')
    setUser(null)
    router.push('/signin')
  }

  return (
    <header className="p-6 bg-white bg-opacity-90 backdrop-blur-sm sticky top-0 z-10">
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/">
            <h1 className="text-2xl font-bold text-indigo-800">MemoryMaster</h1>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-indigo-600">Welcome, {user.name}</span>
              <Button variant="ghost" onClick={handleSignOut} className="text-indigo-600 hover:text-indigo-800">
                Sign Out
              </Button>
            </div>
          ) : (
            <Link href="/signin" passHref>
              <Button variant="ghost" className="text-indigo-600 hover:text-indigo-800">
                Sign In
              </Button>
            </Link>
          )}
        </motion.div>
      </nav>
    </header>
  )
}