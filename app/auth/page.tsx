'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Home } from 'lucide-react'

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isWideScreen, setIsWideScreen] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsWideScreen(window.innerWidth >= 1000)
    }

    checkScreenWidth()
    window.addEventListener('resize', checkScreenWidth)

    return () => window.removeEventListener('resize', checkScreenWidth)
  }, [])

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

  const renderForm = () => (
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
      
        </div>
      )}
      <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
        {isSignIn ? 'Sign In' : 'Sign Up'}
      </Button>
    </form>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      <Card className={`w-full ${isWideScreen ? 'max-w-4xl' : 'max-w-md'} overflow-hidden shadow-xl relative`}>
        <Link href="/" className="absolute top-4 left-4 z-10">
          <Button 
            variant="ghost" 
            className={`flex items-center space-x-2 p-2 transition-colors ${
              isSignIn
                ? 'text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100'
                : 'text-white hover:text-white hover:bg-indigo-700'
            }`}
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Button>
        </Link>
        {isWideScreen ? (
          <div className="flex flex-col md:flex-row h-[600px]">
            <motion.div 
              className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-white"
              animate={{ x: isSignIn ? 0 : '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
                {isSignIn ? 'Sign In' : 'Sign Up'}
              </h2>
              <p className="text-center text-sm text-gray-600 mb-6">Use your email to {isSignIn ? 'sign in' : 'sign up'}</p>
              {renderForm()}
            </motion.div>
            <motion.div 
              className="w-full md:w-1/2 bg-indigo-800 text-white p-8 flex flex-col justify-center items-center relative overflow-hidden"
              animate={{ x: isSignIn ? 0 : '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="relative z-10 text-center">
                <h3 className="text-3xl font-bold mb-4">
                  {isSignIn ? 'Hello, Friend!' : 'Welcome Back!'}
                </h3>
                <p className="mb-8">
                  {isSignIn 
                    ? 'Enter your personal details and start your journey with us'
                    : 'To keep connected with us please login with your personal info'}
                </p>
                <Button 
                  variant="outline" 
                  onClick={toggleMode}
                  className="border-white text-indigo-800 bg-white hover:bg-transparent hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  {isSignIn ? 'Sign Up' : 'Sign In'}
                </Button>
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-teal-400 rounded-tl-full"></div>
            </motion.div>
          </div>
        ) : (
          <div className="p-8 bg-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={isSignIn ? 'signin' : 'signup'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
                  {isSignIn ? 'Sign In' : 'Sign Up'}
                </h2>
                <p className="text-center text-sm text-gray-600 mb-6">Use your email to {isSignIn ? 'sign in' : 'sign up'}</p>
                {renderForm()}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    {isSignIn ? "Don't have an account?" : "Already have an account?"}
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={toggleMode}
                    className="border-indigo-600 bg-white-600 text-indigo-600 hover:bg-white hover:text-indigo-600 transition-all duration-300 ease-in-out transform hover:scale-105"
                  >
                    {isSignIn ? 'Sign Up' : 'Sign In'}
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </Card>
    </div>
  )
}