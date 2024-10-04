'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Brain, Zap, Trophy, CreditCard, LogOut, ChevronRight, Menu, X, User, Check } from 'lucide-react'

interface User {
  _id: string;
  name: string;
  email: string;
  hasPaid: boolean;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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
    router.push('/auth')
  }

  const handleUpgradeClick = () => {
    if (user) {
      router.push('/upgrade')
    } else {
      router.push('/auth')
    }
  }

  const handleStartTest = () => {
    router.push('/tasks')
  }

  const features = [
    { icon: Brain, title: 'Memory Game', description: 'Engage in fun and challenging memory exercises' },
    { icon: Zap, title: 'Quick Recall', description: 'Improve your ability to quickly recall information' },
    { icon: Trophy, title: 'Track Progress', description: 'Monitor your improvement over time' },
    { icon: CreditCard, title: 'Premium Features', description: 'Access advanced tasks and personalized training' },
  ]

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Brain className="h-8 w-auto sm:h-10 text-indigo-600" />
                <span className="ml-2 text-2xl font-bold text-indigo-600">Nrglitch</span>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-10 flex-grow justify-center">
              <a href="#test-my-memory" className="text-base font-medium text-gray-500 hover:text-indigo-600">Test My Memory</a>
              <a href="#our-story" className="text-base font-medium text-gray-500 hover:text-indigo-600">Our Story</a>
              <a href="#premium" className="text-base font-medium text-gray-500 hover:text-indigo-600">Premium</a>
            </nav>
            <div className="hidden md:flex items-center">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-indigo-600 font-medium">Welcome, {user.name || user.email.split('@')[0]}</span>
                  <Button variant="outline" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link href="/auth" passHref>
                  <Button variant="outline">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Sign In / Sign Up</span>
                  </Button>
                </Link>
              )}
            </div>
            <div className="md:hidden">
              <Button
                variant="ghost"
                className="inline-flex items-center justify-center p-2 rounded-md text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                onClick={toggleMenu}
              >
                <span className="sr-only">Open menu</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed top-16 left-0 right-0 bg-white z-40 shadow-md"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#test-my-memory" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50" onClick={toggleMenu}>Test My Memory</a>
              <a href="#our-story" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50" onClick={toggleMenu}>Our Story</a>
              <a href="#premium" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50" onClick={toggleMenu}>Premium</a>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              {user ? (
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <User className="h-10 w-10 rounded-full" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user.name || user.email.split('@')[0]}</div>
                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                  </div>
                  <Button variant="outline" onClick={handleSignOut} className="ml-auto">
                    <LogOut className="h-6 w-6" />
                    <span className="sr-only">Sign out</span>
                  </Button>
                </div>
              ) : (
                <div className="px-5">
                  <Link href="/auth" passHref>
                    <Button variant="outline" className="w-full justify-center" onClick={toggleMenu}>
                      <User className="mr-2 h-5 w-5" />
                      Sign In / Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Test My Memory Section */}
        <section id="test-my-memory" className="pt-24 md:pt-32 mb-24">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="text-container text-center lg:text-left w-full lg:w-1/2">
              <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl sm:tracking-tight lg:text-7xl mb-6">
                <span>Master</span> <br />
                <span className="text-indigo-600">Every Aspect</span> <br />
                <span>Of Your Memory</span>
              </h1>
              <p className="mt-5 text-xl text-gray-600 max-w-3xl mx-auto lg:mx-0 mb-8">
                Nrglitch: Sharpen your mind with engaging memory exercises backed by cognitive science.
              </p>
              <Button 
                onClick={handleStartTest}
                className="text-lg px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition duration-300"
              >
                Start the Test 🧠
              </Button>
            </div>
            <div className="video-container mt-10 lg:mt-0 lg:ml-10 w-full lg:w-1/2">
              <div className="relative w-full max-w-xl mx-auto lg:max-w-none h-0 pb-[40%] lg:pb-[50%] overflow-hidden shadow-2xl">
                <div 
                  className="absolute inset-0 bg-indigo-600" 
                  style={{ 
                    borderRadius: '52px 52px 35px 35px / 13px 13px 13px 13px',
                  }}
                >
                  <video 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[98%] h-[98%] object-cover"
                    style={{ 
                      borderRadius: '50px 50px 33px 33px / 11px 11px 11px 11px',
                    }}
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                  >
                    <source src="/placeholder.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section id="our-story" className="mb-24 scroll-mt-20 md:scroll-mt-24">
          <h2 className="text-4xl font-bold text-center mb-8">Our Story</h2>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <p className="text-lg text-gray-700 mb-4">
              Nrglitch was born out of a passion for cognitive science and a desire to help people improve their memory and mental acuity. Our team of neuroscientists, software engineers, and game designers came together with a shared vision: to create engaging, scientifically-backed exercises that make memory training both fun and effective.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              We believe that a strong memory is fundamental to success in all areas of life. Whether you're a student trying to ace your exams, a professional looking to stay sharp in your career, or simply someone who wants to keep their mind agile as they age, Nrglitch is here to support your journey.
            </p>
            <p className="text-lg text-gray-700">
              Join us in our mission to unlock the full potential of your mind. With Nrglitch, every day is an opportunity to challenge yourself, grow, and discover the incredible capabilities of your memory.
            </p>
          </div>
        </section>

        {/* Premium Section */}
        <section id="premium" className="mb-24 scroll-mt-20 md:scroll-mt-24">
          <h2 className="text-4xl font-bold text-center mb-8">Premium Lifetime Access</h2>
          <div className="max-w-md mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h3 className="text-2xl font-semibold mb-4">Lifetime Deal</h3>
              <p className="text-5xl font-bold mb-6">€1.99</p>
              <p className="text-lg text-gray-600 mb-6">One-time payment for lifetime access</p>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>50+ memory games covering all aspects</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Advanced progress tracking and analytics</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Personalized training plans</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Visual memory enhancement tasks</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Auditory memory improvement exercises</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Working memory capacity boosters</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Long-term memory retention techniques</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Ad-free experience</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Priority customer support</span>
                </li>
              </ul>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleUpgradeClick}>
                Get Lifetime Access
              </Button>
            </div>
          </div>
        </section>

        {/* Features sectionn */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <feature.icon className="h-10 w-10 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-8 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <h3 className="text-2xl font-bold mb-4 md:mb-0">Nrglitch</h3>
          <div className="flex space-x-6">
            <a href="#our-story" className="hover:text-indigo-200">Our Story</a>
            <Link href="/contact" className="hover:text-indigo-200">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}