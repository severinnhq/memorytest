'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Zap, Trophy, CreditCard, LogOut, ChevronRight, Menu, X, User } from 'lucide-react'

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

  const features = [
    { icon: Brain, title: 'Memory Game', description: 'Engage in fun and challenging memory exercises' },
    { icon: Zap, title: 'Quick Recall', description: 'Improve your ability to quickly recall information' },
    { icon: Trophy, title: 'Track Progress', description: 'Monitor your improvement over time' },
    { icon: CreditCard, title: 'Premium Features', description: 'Access advanced tasks and personalized training' },
  ]

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Link href="/" className="flex items-center">
                <span className="sr-only">MemoryMaster</span>
                <Brain className="h-8 w-auto sm:h-10 text-indigo-600" />
                <span className="ml-2 text-2xl font-bold text-indigo-600">MemoryMaster</span>
              </Link>
            </div>
            <div className="-mr-2 -my-2 md:hidden">
              <Button
                variant="ghost"
                className="inline-flex items-center justify-center p-2 rounded-md text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                onClick={toggleMenu}
              >
                <span className="sr-only">Open menu</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
              </Button>
            </div>
            <nav className="hidden md:flex space-x-10">
              <Link href="/test-memory" className="text-base font-medium text-gray-500 hover:text-indigo-600 transition duration-150 ease-in-out">Test My Memory</Link>
              <Link href="/about" className="text-base font-medium text-gray-500 hover:text-indigo-600 transition duration-150 ease-in-out">About Us</Link>
              <Link href="/premium-tasks" className="text-base font-medium text-gray-500 hover:text-indigo-600 transition duration-150 ease-in-out">More Premium Tasks</Link>
            </nav>
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-indigo-600 font-medium">
                    Welcome, {user.name || user.email.split('@')[0]}
                  </span>
                  <Button variant="outline" onClick={handleSignOut} className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-indigo-600 bg-white hover:bg-indigo-50">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link href="/auth" passHref>
                  <Button variant="outline" className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-indigo-600 bg-white hover:bg-indigo-50">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Sign In / Sign Up</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
            >
              <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
                <div className="pt-5 pb-6 px-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <Brain className="h-8 w-auto text-indigo-600" />
                    </div>
                    <div className="-mr-2">
                      <Button
                        variant="ghost"
                        className="bg-white rounded-md p-2 inline-flex items-center justify-center text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        onClick={toggleMenu}
                      >
                        <span className="sr-only">Close menu</span>
                        <X className="h-6 w-6" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-6">
                    <nav className="grid gap-y-8">
                      <Link href="/test-memory" className="text-base font-medium text-gray-900 hover:text-indigo-600">
                        Test My Memory
                      </Link>
                      <Link href="/about" className="text-base font-medium text-gray-900 hover:text-indigo-600">
                        About Us
                      </Link>
                      <Link href="/premium-tasks" className="text-base font-medium text-gray-900 hover:text-indigo-600">
                        More Premium Tasks
                      </Link>
                    </nav>
                  </div>
                </div>
                <div className="py-6 px-5 space-y-6">
                  <div>
                    {user ? (
                      <div className="space-y-4">
                        <span className="text-indigo-600 font-medium block">
                          Welcome, {user.name || user.email.split('@')[0]}
                        </span>
                        <Button variant="outline" onClick={handleSignOut} className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-indigo-600 bg-white hover:bg-indigo-50">
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <Link href="/auth" passHref>
                        <Button variant="outline" className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-indigo-600 bg-white hover:bg-indigo-50">
                          <User className="mr-2 h-5 w-5" />
                          Sign In / Sign Up
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl sm:tracking-tight lg:text-7xl mb-6">
            Master{' '}
            <span className="text-indigo-600">Every Aspect</span>{' '}
            of Your Memory
          </h1>
          <p className="mt-5 text-xl text-gray-600 max-w-3xl mx-auto">
            MemoryMaster: Where cognitive enhancement meets engaging gameplay. Sharpen your mind, boost your memory, and track your progress with our scientifically designed exercises.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={feature.title} className="bg-white hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <feature.icon className="h-10 w-10 text-indigo-600 mb-2" />
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-20 text-center space-y-6">
          {user ? (
            <>
              <Link href="/games" passHref>
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                  Start Your Training
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {!user.hasPaid && (
                <div className="mt-4">
                  <Button 
                    size="lg" 
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={handleUpgradeClick}
                  >
                    Upgrade to Premium
                    <CreditCard className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <>
              <Link href="/auth" passHref>
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 mr-4">
                  Get Started
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                onClick={handleUpgradeClick}
              >
                Explore Premium Features
                <CreditCard className="ml-2 h-5 w-5" />
              </Button>
            </>
          )}
        </div>

        <div className="mt-24 bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose MemoryMaster?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center">
                <Brain className="h-6 w-6 text-indigo-600 mr-2" />
                Scientifically Designed
              </h3>
              <p className="text-gray-600">Our exercises are crafted based on cognitive science research to effectively enhance your memory and mental agility.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center">
                <Zap className="h-6 w-6 text-indigo-600 mr-2" />
                Adaptive Difficulty
              </h3>
              <p className="text-gray-600">Games adjust to your skill level, ensuring you're always challenged but never overwhelmed.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center">
                <Trophy className="h-6 w-6 text-indigo-600 mr-2" />
                Progress Tracking
              </h3>
              <p className="text-gray-600">Visualize your improvement over time with detailed statistics and performance metrics.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center">
                <CreditCard className="h-6 w-6 text-indigo-600 mr-2" />
                Premium Experience
              </h3>
              <p className="text-gray-600">Unlock advanced features and personalized training plans with our premium subscription.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-indigo-900 text-white py-8 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-2xl font-bold">MemoryMaster</h3>
            <p className="mt-2 text-indigo-200">Empowering minds, one game at a time.</p>
          </div>
          <div className="flex space-x-6">
            <Link href="/about" className="hover:text-indigo-200 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-indigo-200 transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:text-indigo-200 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}