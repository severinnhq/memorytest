'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const endpoint = isSignIn ? '/api/signin' : '/api/signup'
      const body = isSignIn ? { email, password } : { name, email, password }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push('/')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'An error occurred. Please try again.')
      }
    } catch (error) {
      console.error('Auth error:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const toggleMode = () => setIsSignIn(!isSignIn)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <Card className="w-full max-w-4xl overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row h-[600px]">
          <motion.div 
            className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-white"
            animate={{ x: isSignIn ? 0 : '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              {isSignIn ? 'Sign In' : 'Sign Up'}
            </h2>
            <p className="text-center text-sm text-gray-600 mb-6">Use your email to {isSignIn ? 'sign in' : 'sign up'}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isSignIn && (
                <Input
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {isSignIn && (
                <div className="text-right">
                  <a href="#" className="text-sm text-indigo-600 hover:underline">Forgot your password?</a>
                </div>
              )}
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                {isSignIn ? 'Sign In' : 'Sign Up'}
              </Button>
            </form>
          </motion.div>
          <motion.div 
            className="w-full md:w-1/2 bg-indigo-800 text-white p-8 flex flex-col justify-center items-center relative overflow-hidden"
            animate={{ x: isSignIn ? 0 : '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4">
                {isSignIn ? 'Hello, Friend!' : 'Welcome Back!'}
              </h3>
              <p className="mb-8 text-center">
                {isSignIn 
                  ? 'Enter your personal details and start your journey with us'
                  : 'To keep connected with us please login with your personal info'}
              </p>
              <Button 
                variant="outline" 
                onClick={toggleMode}
                className="border-white text-white hover:bg-white hover:text-indigo-800"
              >
                {isSignIn ? 'Sign Up' : 'Sign In'}
              </Button>
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-teal-400 rounded-tl-full"></div>
          </motion.div>
        </div>
      </Card>
    </div>
  )
}