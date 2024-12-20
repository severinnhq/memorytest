'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion, } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, LogOut, Menu, User, Check,  Plus, Clock,  Sparkles, Mail, Trophy, Star, Twitter, HouseIcon, BookOpen, Lightbulb, Rocket, Users, } from 'lucide-react'
import Image from 'next/image'
import { loadStripe } from '@stripe/stripe-js'

interface User {
  _id: string;
  name: string;
  email: string;
  hasPaid: boolean;
}
   {/* Header
interface MemoryType {
  name: string;
  icon: React.ReactNode;
  image: string;
}
*/}
const faqItems = [
  {
    question: "What is Nrglitch?",
    answer: "Nrglitch is an innovative memory training platform designed to help you improve various aspects of your memory through engaging exercises."
  },
  {
    question: "Is there a community or support team available?",
    answer: "Yes, at the contact section you can find our contact details, please feel free to reach us if you have any question, recommendation or problem."
  },
  {
    question: "Can Nrglitch help with specific memory problems?",
    answer: "Yes, we already have a specific tasks for every aspect and the premium tests include them all. And in addition to these we are about release ASPECT BASED tests, and planning to make personalised tasks/tests."
  }
]
    {/* Header 
const memoryTypes: MemoryType[] = [
  { 
    name: 'Short-term', 
    icon: <Clock className="h-5 w-5" />,
    image: "/severinn.png  "
  },
  { 
    name: 'Long-term', 
    icon: <Database className="h-5 w-5" />,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f0f0f0'/%3E%3Ctext x='400' y='300' font-family='Arial' font-size='24' fill='%23333' text-anchor='middle' dominant-baseline='middle'%3ELong-term Memory%3C/text%3E%3C/svg%3E"
  },
  { 
    name: 'Working', 
    icon: <Brain className="h-5 w-5" />,
    image: "/working-memory.png"
  },
  { 
    name: 'Semantic', 
    icon: <FileText className="h-5 w-5" />,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f0f0f0'/%3E%3Ctext x='400' y='300' font-family='Arial' font-size='24' fill='%23333' text-anchor='middle' dominant-baseline='middle'%3ESemantic Memory%3C/text%3E%3C/svg%3E"
  },
  { 
    name: 'Episodic', 
    icon: <Film className="h-5 w-5" />,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f0f0f0'/%3E%3Ctext x='400' y='300' font-family='Arial' font-size='24' fill='%23333' text-anchor='middle' dominant-baseline='middle'%3EEpisodic Memory%3C/text%3E%3C/svg%3E"
  },
  { 
    name: 'Procedural', 
    icon: <Layers className="h-5 w-5" />,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f0f0f0'/%3E%3Ctext x='400' y='300' font-family='Arial' font-size='24' fill='%23333' text-anchor='middle' dominant-baseline='middle'%3EProcedural Memory%3C/text%3E%3C/svg%3E"
  },
  { 
    name: 'Sensory', 
    icon: <Zap className="h-5 w-5" />,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f0f0f0'/%3E%3Ctext x='400' y='300' font-family='Arial' font-size='24' fill='%23333' text-anchor='middle' dominant-baseline='middle'%3ESensory Memory%3C/text%3E%3C/svg%3E"
  },
  { 
    name: 'Prospective', 
    icon: <Lightbulb className="h-5 w-5" />,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f0f0f0'/%3E%3Ctext x='400' y='300' font-family='Arial' font-size='24' fill='%23333' text-anchor='middle' dominant-baseline='middle'%3EProspective Memory%3C/text%3E%3C/svg%3E"
  },
]
*/}
export default function Component() {
  const timelineItems = [
    {
      icon: <Rocket className="w-8 h-8 text-indigo-500" />,
      title: "The Beginning",
      content: "I've had experience in the online business world, having built a couple of successful ventures, and I used to do web development. However, I wasn't good at multitasking and couldn't imagine my life without a to-do list.",
    },
    {
      icon: <Users className="w-8 h-8 text-purple-500" />,
      title: "The Party Conversation",
      content: "During a conversation at a party, people were discussing how they often forget things. A guy mentioned he had learned about the different components of memory. Intrigued by the discussion, I approached him, and the next day we had a more in-depth conversation on Discord.",
    },
    {
      icon: <Brain className="w-8 h-8 text-pink-500" />,
      title: "The Discovery",
      content: "He explained that it's possible to identify which part of your memory is responsible for various types of forgetfulness in daily life, and that you can improve specific aspects of memory accordingly.",
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
      title: "The Experiment",
      content: "I didn't experience significant forgetfulness myself, but I decided to try his method. I can confidently say it made a difference—I can now recall and remember things much faster and more effectively.",
    },
    {
      icon: <Star className="w-8 h-8 text-green-500" />,
      title: "The Solution",
      content: "Nrglitch offers a basic test designed to evaluate different facets of your memory, providing scores and insights into your performance across eight key areas. Additionally, there are premium features that offer more challenging tasks to further enhance your memory skills.",
    },
  ]

  const [user, setUser] = useState<User | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  //const [activeMemoryType, setActiveMemoryType] = useState<string>(memoryTypes[0].name)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const cardRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  
 
  
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true)
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          if (parsedUser && typeof parsedUser === 'object') {
            // Fetch the latest user data from the server
            const response = await fetch(`/api/user/${parsedUser._id}`)
            if (response.ok) {
              const userData = await response.json()
              setUser(userData)
              // Update local storage with the latest data
              localStorage.setItem('user', JSON.stringify(userData))
            } else {
              console.error('Failed to fetch user data')
              localStorage.removeItem('user')
            }
          } else {
            console.error('Invalid user data in localStorage')
            localStorage.removeItem('user')
          }
        } catch (error) {
          console.error('Error parsing user data:', error)
          localStorage.removeItem('user')
        }
      }
      setIsLoading(false)
    }
  
    fetchUserData()
  }, [])
  
  const handleSignOut = () => {
    localStorage.removeItem('user')
    setUser(null)
    router.push('/auth')
  }
  
  const handleUpgradeClick = async () => {
    if (!user) {
      router.push('/auth')
    } else if (!user.hasPaid) {
      setIsLoading(true)
      try {
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user._id }),
        })
  
        if (!response.ok) {
          throw new Error('Failed to create checkout session')
        }
  
        const { sessionId } = await response.json()
  
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({ sessionId })
          if (error) {
            throw error
          }
        }
      } catch (error) {
        console.error('Error creating checkout session:', error)
        // Handle error (e.g., show error message to user)
      } finally {
        setIsLoading(false)
      }
    }
  }
  

  const handleStartTest = () => {
    router.push('/test')
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      setGlowPosition({ x, y })
    }
  }
  



    
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="bg-white shadow-md fixed top-0 left-0 right-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Brain className="h-8 w-auto sm:h-10 text-[#4f46e5]" />
                <span className="ml-2 text-2xl font-bold text-[#4f46e5]">Nrglitch</span>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-10 flex-grow justify-center">
              <a href="/" className="text-base font-medium text-gray-500 hover:text-[#4f46e5] transition-colors duration-200">Home</a>
              <a href="/#premium" className="text-base font-medium text-gray-500 hover:text-[#4f46e5] transition-colors duration-200">Premium</a>
              <a href="/#our-story" className="text-base font-medium text-gray-500 hover:text-[#4f46e5] transition-colors duration-200">Our Story</a>
            </nav>
            <div className="hidden md:flex items-center">
              {user ? (
                <div className="flex items-center space-x-4">
                  <User className="h-8 w-8 text-[#4f46e5]"  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-[#4f46e5]">{user.name || user.email.split('@')[0]}</span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                  <Button variant="ghost" onClick={handleSignOut} className="p-1">
                    <LogOut className="h-6 w-6 text-[#4f46e5]" />
                  </Button>
                </div>
              ) : (
                <Link href="/auth" passHref>
                  <Button variant="outline" className="border-[#4f46e5]   text-[#4f46e5]">
                    <User className="h-5 w-5 mr-2" />
                    Sign In / Sign Up
                  </Button>
                </Link>
              )}
            </div>
            <div className="md:hidden">
              <Button
                variant="ghost"
                className="inline-flex items-center justify-center p-2 rounded-md text-[#4f46e5] hover:text-[#4f46e5] hover:bg-[#4f46e5]/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#4f46e5]"
                onClick={toggleMenu}
              >
                <span className="sr-only">Open menu</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed top-16 left-0 right-0 bg-white z-40 shadow-md"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-[#4f46e5] hover:bg-[#4f46e5]/10" onClick={toggleMenu}>Home</a>
              <a href="/#premium" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-[#4f46e5] hover:bg-[#4f46e5]/10" onClick={toggleMenu}>Premium</a>
              <a href="/#our-story" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-[#4f46e5] hover:bg-[#4f46e5]/10" onClick={toggleMenu}>Our Story</a>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              {user ? (
                <div className="flex items-center px-5">
                  <User className="h-8 w-8 text-[#4f46e5]" />
                  <div className="ml-3">
                    <div className="text-base font-medium text-[#4f46e5]">{user.name || user.email.split('@')[0]}</div>
                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                  </div>
                  <Button variant="ghost" onClick={handleSignOut} className="ml-auto p-1">
                    <LogOut className="h-6 w-6 text-[#4f46e5]" />
                  </Button>
                </div>
              ) : (
                <div className="px-5">
                  <Link href="/auth" passHref>
                    <Button variant="outline" className="w-full justify-center border-[#4f46e5] text-[#4f46e5] hover:bg-[#4f46e5] hover:text-white" onClick={toggleMenu}>
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
       <main className="pt-8 ">
        {/* Hero Section */}
        <motion.section 
          id="hero" 
          className="flex items-center justify-center min-h-screen py-20 lg:py-0 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background SVG */}
          <div className="absolute inset-0 overflow-hidden">
  <svg className="absolute w-full h-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.05" /> {/* Reduced opacity for the first color stop */}
        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.05" /> {/* Reduced opacity for the second color stop */}
      </linearGradient>
    </defs>
    <path fill="url(#bg-gradient)" d="M998.7 439.2c1.7-26.5 1.7-52.7 0.1-78.5L401 399.9c0 0 0-0.1 0-0.1l587.6-116.9c-5.1-25.9-11.9-51.2-20.3-75.8L400.9 399.7c0 0 0-0.1 0-0.1l537.3-265c-11.6-23.5-24.8-46.2-39.3-67.9L400.8 399.5c0 0 0-0.1-0.1-0.1l450.4-395c-17.3-19.7-35.8-38.2-55.5-55.5l-395 450.4c0 0-0.1 0-0.1-0.1L733.4-99c-21.7-14.5-44.4-27.6-68-39.3l-265 537.4c0 0-0.1 0-0.1 0l192.6-567.4c-24.6-8.3-49.9-15.1-75.8-20.2L400.2 399c0 0-0.1 0-0.1 0l39.2-597.7c-26.5-1.7-52.7-1.7-78.5-0.1L399.9 399c0 0-0.1 0-0.1 0L282.9-188.6c-25.9 5.1-51.2 11.9-75.8 20.3l192.6 567.4c0 0-0.1 0-0.1 0l-265-537.3c-23.5 11.6-46.2 24.8-67.9 39.3l332.8 498.1c0 0-0.1 0-0.1 0.1L4.4-51.1C-15.3-33.9-33.8-15.3-51.1 4.4l450.4 395c0 0 0 0.1-0.1 0.1L-99 66.6c-14.5 21.7-27.6 44.4-39.3 68l537.4 265c0 0 0 0.1 0 0.1l-567.4-192.6c-8.3 24.6-15.1 49.9-20.2 75.8L399 399.8c0 0 0 0.1 0 0.1l-597.7-39.2c-1.7 26.5-1.7 52.7-0.1 78.5L399 400.1c0 0 0 0.1 0 0.1l-587.6 116.9c5.1 25.9 11.9 51.2 20.3 75.8l567.4-192.6c0 0 0 0.1 0 0.1l-537.3 265c11.6 23.5 24.8 46.2 39.3 67.9l498.1-332.8c0 0 0 0.1 0.1 0.1l-450.4 395c17.3 19.7 35.8 38.2 55.5 55.5l395-450.4c0 0 0.1 0 0.1 0.1L66.6 899c21.7 14.5 44.4 27.6 68 39.3l265-537.4c0 0 0.1 0 0.1 0L207.1 968.3c24.6 8.3 49.9 15.1 75.8 20.2L399.8 401c0 0 0.1 0 0.1 0l-39.2 597.7c26.5 1.7 52.7 1.7 78.5 0.1L400.1 401c0 0 0.1 0 0.1 0l116.9 587.6c25.9-5.1 51.2-11.9 75.8-20.3L400.3 400.9c0 0 0.1 0 0.1 0l265 537.3c23.5-11.6 46.2-24.8 67.9-39.3L400.5 400.8c0 0 0.1 0 0.1-0.1l395 450.4c19.7-17.3 38.2-35.8 55.5-55.5l-450.4-395c0 0 0-0.1 0.1-0.1L899 733.4c14.5-21.7 27.6-44.4 39.3-68l-537.4-265c0 0 0-0.1 0-0.1l567.4 192.6c8.3-24.6 15.1-49.9 20.2-75.8L401 400.2c0 0 0-0.1 0-0.1L998.7 439.2z"></path>
  </svg>
</div>

          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-center">
              <motion.div 
                className="text-container text-center lg:text-left w-full lg:w-1/2 mb-12 lg:mb-0"

              >
                <h1 className="text-3xl sm:text-5xl lg:text-4.5xl font-extrabold text-gray-900 tracking-tight mb-6">
                  <span className="block my-2">Keep</span>
                  <span className="block my-2">
                    <span className="relative inline-block">
                      <span className="absolute inset-0 bg-[#4f46e5] bg-opacity-45 transform -rotate-2 origin-center"></span>
                      <span className="relative text-black-lg px-1">Forgetting</span>
                    </span> 
                    <span> 
                      <span className="text-black px-1"><u>Birthdays</u></span>
                    </span>
                  </span>
                  <span className="block">Or
                    <span className="text-black px-1"><u> Song  Titles?</u></span>
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-500 mb-8">
                  {"Discover which part of your memory is responsible, target it with science-backed tasks, and improve it step by step."}
                </p>
                <div className="relative inline-block">
                  <Button
                    onClick={handleStartTest}
                    onMouseEnter={() => setIsButtonHovered(true)}
                    onMouseLeave={() => setIsButtonHovered(false)}
                    className="relative z-10 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-white bg-[#4f46e5] hover:bg-[#4338ca] transition-colors duration-300"
                  >
                    Start the Test 🧠
                  </Button>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className={`w-full h-full bg-[#4f46e5]/40 filter blur-md transition-all duration-300 ease-out ${isButtonHovered ? 'opacity-75 scale-105' : 'opacity-0 scale-100'}`}></div>
                  </div>
                </div>
              </motion.div>
              <motion.div 
                className="w-full lg:w-1/2 relative"
    
              >
                <Image
                  src="/hero.png"
                  alt="Illustration of various memory concepts"
                  width={1000}
                  height={1000}
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                  priority
                />
              </motion.div>
            </div>
          </div>
        </motion.section>

      {/* Our Story */}
<motion.section 
  id="our-story" 
  className="py-24 mb-12 mt-12 overflow-hidden relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.8 }}
>
  <div className="container  mx-auto px-4 relative z-10">
    <motion.h2 
      className="text-4xl font-bold mb-16 text-center text-gray-800"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      Our Journey
    </motion.h2>

    <div className="relative">
      {timelineItems.map((item, index) => (
        <motion.div 
          key={index}
          className={`flex items-center mb-16 md:flex-row ${
            index % 2 === 0
              ? 'md:flex-row-reverse md:pl-8' 
              : 'md:pr-8'
          }`}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: index * 0.2 }}
          style={{ gap: '16px' }}  // Add a gap to create space between items and line
        >
          <div className="w-full md:w-1/2 md:px-4">
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300"
              whileHover={{ scale: 1.05 }}
              style={{ margin: '0 16px' }} // Add margin to further push boxes away from the line
            >
              <div className="flex items-center mb-4 justify-center">
                {item.icon}
                <h3 className="text-2xl font-semibold ml-2 text-gray-800">{item.title}</h3>
              </div>
              <p className="text-gray-600">{item.content}</p>
            </motion.div>
          </div>
          <div className="w-8 h-8 absolute left-0 md:left-1/2 transform md:translate-x-[-50%] -translate-y-4 rounded-full bg-indigo-500 border-4 border-white shadow"></div>
        </motion.div>
      ))}
      <div className="absolute h-full w-1 bg-indigo-200 left-4 md:left-1/2 md:-translate-x-1/2 top-0"></div>
    </div>

    <motion.div 
      className="mt-16 text-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1 }}
    >
      <h3 className="text-3xl font-bold mb-4 text-gray-800">Ready to Explore?</h3>
      <p className="text-xl text-gray-700 mb-8">Try our basic test!</p>
      <Button
                    onClick={handleStartTest}
                    onMouseEnter={() => setIsButtonHovered(true)}
                    onMouseLeave={() => setIsButtonHovered(false)}
                    className="relative z-10 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-white bg-[#4f46e5] hover:bg-[#4338ca] transition-colors duration-300"
                  >
                    Start the Test 🧠
                  </Button>
    </motion.div>
  </div>
</motion.section>



          {/* Premium Section */}
          
          <motion.section 
            id="premium" 
            className="py-24 mt-12 mb-12 mx-auto w-full px-4 sm:px-6 lg:px-8  "

            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Premium Access</h2>
            {isLoading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
              </div>
            ) : user && user.hasPaid ? (
              <div className="max-w-4xl mx-auto">
                <Card className="bg-gradient-to-br from-[#4f46e5]/10 to-[#4f46e5]/5 border-[#4f46e5]/20">

                  <CardContent className="space-y-8 pt-12 pb-12">
                    <p className="text-xl text-center text-gray-600">You have full access to all premium features. Enhance your memory skills with our advanced tools and exercises.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
                        <Trophy className="h-12 w-12 text-[#4f46e5] mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Mid-Level test</h3>
                        <p className="text-center text-gray-500">Quite hard tasks, expect fast improvement.</p>
                      </div>
                      <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
                        <Star className="h-12 w-12 text-[#4f46e5] mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Advanced-Level test</h3>
                        <p className="text-center text-gray-500">Very challenging tasks. Elevate your improvement.</p>
                      </div>
                      <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
                        <Sparkles className="h-12 w-12 text-[#4f46e5] mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Upcoming AI access</h3>
                        <p className="text-center text-gray-500">Train and improve the weakest part of your memory with our upcoming AI detector</p>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <Button
                        onClick={() => router.push('/premium-tasks')}
                        className="bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <Sparkles className="w-5 h-5 mr-2" />
                        Explore Premium Features
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="max-w-lg mx-auto relative">
                <div 
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                  style={{
                    opacity: isHovering ? 1 : 0,
                    background: `radial-gradient(circle 300px at ${glowPosition.x}px ${glowPosition.y}px, rgba(79, 70, 229, 0.4), transparent 70%)`,
                    filter: 'blur(40px)',
                    transform: 'translate(-20px, -20px)',
                    width: 'calc(100% + 40px)',
                    height: 'calc(100% + 40px)',
                  }}
                />
                <Card 
                  ref={cardRef}
                  className="relative bg-white rounded-2xl shadow-xl overflow-hidden"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                <CardContent className="p-8">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-2xl font-bold text-gray-800">Lifetime Deal</h3>
      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-[#4f46e5] rounded-full">BEST VALUE</span>
    </div>
    <div className="flex items-end mb-6">
      <span className="text-5xl font-extrabold text-gray-900">€1.99</span>
      <span className="text-xl text-gray-500 ml-2">/ lifetime</span>
    </div>
    <p className="text-gray-500 mb-8">
      {"One-time payment for unlimited access to premium features"}
    </p>
    <ul className="space-y-4 mb-8">
      {[
        "Mid-Level memory test",
        "Advanced-Level memory test",
        "Every aspect of the memory covered",
        "Automatic access to the fourthcoming ASPECT BASED tests",
        "Automatic access to the upcoming AI memory detector"
      ].map((feature, index) => (
        <motion.li 
          key={index}
          className="flex items-center space-x-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          {feature.includes("ASPECT BASED") || feature.includes("AI memory") ? (
            <Clock className="h-5 w-5 text-indigo-500" /> // Replace with your coming soon icon
          ) : (
            <Check className="h-5 w-5 text-green-500" />
          )}
          <span className="text-gray-500">{feature}</span>
        </motion.li>
      ))}
    </ul>
    <Button
      onClick={handleUpgradeClick}
      disabled={isLoading}
      className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : (
        <>
          <Sparkles className="w-5 h-5 mr-2" />
          {user ? "Upgrade Now" : "Sign In to Upgrade"}
        </>
      )}
    </Button>
  </CardContent>

                </Card>
              </div>
            )}
          </motion.section>


          
        {/* Memory Types Section 

   
        <motion.section 
          id="memory-types" 
          className="py-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Types of Memory</h2>
            <div className="flex flex-col lg:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="w-full lg:w-1/3 p-4 lg:p-6 lg:max-h-[600px] lg:overflow-y-auto">
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-4">
                  {memoryTypes.map((type) => (
                    <Button
                      key={type.name}
                      variant="ghost"
                      className={`w-full justify-start text-left transition-colors duration-200 h-14 lg:h-16 text-sm lg:text-base ${
                        activeMemoryType === type.name
                          ? 'bg-[#4f46e5]/10 text-[#4f46e5] hover:bg-[#4f46e5]/10 hover:text-[#4f46e5]'
                          : 'hover:bg-[#4f46e5]/10 hover:text-[#4f46e5]'
                      }`}
                      onClick={() => setActiveMemoryType(type.name)}
                    >
                      <div className="flex items-center space-x-2 lg:space-x-4">
                        <div className={`p-1.5 lg:p-2 rounded-full ${
                          activeMemoryType === type.name ? 'bg-[#4f46e5]/20' : 'bg-[#4f46e5]/10'
                        }`}>
                          {type.icon}
                        </div>
                        <span className="truncate">{type.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
              <div className="w-full lg:w-2/3 bg-gray-100">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeMemoryType}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <div className="relative w-full h-0" style={{ paddingBottom: '75%' }}>
                      <Image
                        src={memoryTypes.find(type => type.name === activeMemoryType)?.image || ''}
                        alt={`${activeMemoryType} Memory`}
                        fill
                        style={{ objectFit: 'fill' }}
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.section>
    */}



{/*Contact*/}
    <section id="contact"  className="w-full py-12 mt-12 mb-12 md:py-24 lg:py-32 relative overflow-hidden bg-gradient-to-br from-purple-100 to-pink-200">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[150%] h-[150%] bg-white transform rotate-12 origin-center"></div>
      </div>
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-800">Get in touch</h2>
          <p className="max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            We&apos;re here to help and answer any question you might have. We look forward to hearing from you!
          </p>
          <div className="flex space-x-4 mt-4">
            <a
              href="mailto:nrglitch@gmail.com"
              className="text-gray-600 hover:text-primary transition-colors duration-200"
              aria-label="Email"
            >
              <Mail className="w-6 h-6" />
            </a>
            <a
              href="https://x.com/severinnhq"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary transition-colors duration-200"
              aria-label="Twitter"
            >
              <Twitter className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </section>





        {/* FAQ Section */}
        <motion.section 
          id="faq" 
          className="py-24 mb-12 mt-12 "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="p-4 cursor-pointer" onClick={() => toggleFaq(index)}>
                    <CardTitle className="flex justify-between items-center text-lg">
                      {item.question}
                      <Button variant="ghost" size="sm" className="p-0">
                        <motion.div
                          animate={{ rotate: openFaqIndex === index ? -45 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Plus className="h-4 w-4" />
                        </motion.div>
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <AnimatePresence>
                    {openFaqIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="p-4 bg-gray-50">
                          <p className="text-gray-500">{item.answer}</p>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              ))}
            </div>
          </div>
        </motion.section>

  

        {/* Fixed box severinn mark */}
    <button
      className="fixed bottom-2 right-2 bg-white bg-opacity-70 shadow-lg flex items-center cursor-pointer z-50 rounded-md hover:shadow-xl transition-all duration-300 
                 opacity-70 hover:opacity-100
                 p-1 sm:p-1.5 md:p-2 lg:p-2.5
                 text-[10px] sm:text-xs md:text-sm lg:text-base"
      onClick={() => window.open('https://x.com/severinnhq', '_blank')}
    >
      <Image 
        src="/severinn.png" 
        alt="Made by Severinn" 
        width={24} 
        height={24} 
        className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10"
      />
      <span className="ml-1 sm:ml-1.5 md:ml-2 font-semibold">Made by severinn</span>
    </button>


        {/* Footer */}
        <footer className="bg-[#4f46e5] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center gap-8">
              <Link href="/" className="flex items-center">
                <Brain className="h-8 w-auto sm:h-10 text-white" />
                <span className="ml-2 text-2xl font-bold">Nrglitch</span>
              </Link>
              <nav className="flex flex-wrap justify-center gap-6">
             
                <Link href="/" passHref>
                  <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20">
                    <HouseIcon className="h-5 w-5 mr-2" />
                    Home
                  </Button>
                </Link>
                <Link href="/#our-story" passHref>
                  <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Our Story
                  </Button>
                </Link>
                <Link href="/#premium" passHref>
                  <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Premium
                  </Button>
                </Link>
                <Link href="/#contact" passHref>
                  <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20">
                    <Mail className="h-5 w-5 mr-2" />
                    Contact
                  </Button>
                </Link>
              </nav>
              <p className="text-center text-sm text-gray-300 mt-6">
                &copy; {new Date().getFullYear()} Nrglitch. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}