'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, LogOut, Menu, User, Check, Plus, Clock, Database, FileText, Film, Layers, Zap, Calendar, Sparkles, Play, BookOpen, Mail } from 'lucide-react'
import Image from 'next/image'

interface User {
  _id: string;
  name: string;
  email: string;
  hasPaid: boolean;
}

interface MemoryType {
  name: string;
  icon: React.ReactNode;
  image: string;
}

const faqItems = [
  {
    question: "What is Nrglitch?",
    answer: "Nrglitch is an innovative memory training platform designed to help you improve various aspects of your memory through engaging exercises and personalized training plans."
  },
  {
    question: "How does Nrglitch work?",
    answer: "Nrglitch uses a combination of scientifically-backed memory exercises, progress tracking, and personalized training plans to help you enhance your memory skills. You'll engage in various tasks targeting different types of memory, such as short-term, long-term, and working memory."
  },
  {
    question: "Is Nrglitch suitable for all ages?",
    answer: "Yes, Nrglitch is designed for users of all ages. Whether you're a student looking to improve your study skills, a professional aiming to boost your work performance, or a senior citizen wanting to keep your mind sharp, Nrglitch has exercises tailored to your needs."
  },
  {
    question: "How often should I use Nrglitch?",
    answer: "For best results, we recommend using Nrglitch for at least 15-20 minutes a day, 3-5 times a week. Consistency is key when it comes to improving your memory, so regular practice will yield the best results."
  },
  {
    question: "Can Nrglitch help with specific memory problems?",
    answer: "Yes, Nrglitch offers a variety of exercises targeting different aspects of memory. Whether you struggle with remembering names, misplacing items, or recalling important information, our platform provides specific exercises to address these common memory challenges."
  }
]

const memoryTypes: MemoryType[] = [
  { 
    name: 'Short-term', 
    icon: <Clock className="h-5 w-5" />,
    image: "/placeholder.svg?height=600&width=800&text=Short-term+Memory"
  },
  { 
    name: 'Long-term', 
    icon: <Database className="h-5 w-5" />,
    image: "/placeholder.svg?height=600&width=800&text=Long-term+Memory"
  },
  { 
    name: 'Working', 
    icon: <Brain className="h-5 w-5" />,
    image: "/placeholder.svg?height=600&width=800&text=Working+Memory"
  },
  { 
    name: 'Semantic', 
    icon: <FileText className="h-5 w-5" />,
    image: "/placeholder.svg?height=600&width=800&text=Semantic+Memory"
  },
  { 
    name: 'Episodic', 
    icon: <Film className="h-5 w-5" />,
    image: "/placeholder.svg?height=600&width=800&text=Episodic+Memory"
  },
  { 
    name: 'Procedural', 
    icon: <Layers className="h-5 w-5" />,
    image: "/placeholder.svg?height=600&width=800&text=Procedural+Memory"
  },
  { 
    name: 'Sensory', 
    icon: <Zap className="h-5 w-5" />,
    image: "/placeholder.svg?height=600&width=800&text=Sensory+Memory"
  },
  { 
    name: 'Prospective', 
    icon: <Calendar className="h-5 w-5" />,
    image: "/placeholder.svg?height=600&width=800&text=Prospective+Memory"
  },
]

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const [activeMemoryType, setActiveMemoryType] = useState<string>(memoryTypes[0].name)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 1, 0.2])

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
      const updatedUser = { ...user, hasPaid: true };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      router.push('/premium-tasks');
    } else {
      router.push('/auth');
    }
  }

  const handleStartTest = () => {
    router.push('/tasks')
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
              <a href="" className="text-base font-medium text-muted-foreground hover:text-[#4f46e5] transition-colors duration-200">Test My Memory</a>
              <a href="#premium" className="text-base font-medium text-muted-foreground hover:text-[#4f46e5] transition-colors duration-200">Premium</a>
              <a href="#our-story" className="text-base font-medium text-muted-foreground hover:text-[#4f46e5] transition-colors duration-200">Our Story</a>
            </nav>
            <div className="hidden md:flex items-center">
              {user ? (
                <div className="flex items-center space-x-4">
                  <User className="h-8 w-8 text-[#4f46e5]"  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-[#4f46e5]">{user.name || user.email.split('@')[0]}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                  <Button variant="ghost" onClick={handleSignOut} className="p-1">
                    <LogOut className="h-6 w-6 text-[#4f46e5]" />
                  </Button>
                </div>
              ) : (
                <Link href="/auth" passHref>
                  <Button variant="outline">
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
              <a href="" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-[#4f46e5] hover:bg-[#4f46e5]/10" onClick={toggleMenu}>Test My Memory</a>
              <a href="#premium" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-[#4f46e5] hover:bg-[#4f46e5]/10" onClick={toggleMenu}>Premium</a>
              <a href="#our-story" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-[#4f46e5] hover:bg-[#4f46e5]/10" onClick={toggleMenu}>Our Story</a>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              {user ? (
                <div className="flex items-center px-5">
                  <User className="h-8 w-8 text-[#4f46e5]" />
                  <div className="ml-3">
                    <div className="text-base font-medium text-[#4f46e5]">{user.name || user.email.split('@')[0]}</div>
                    <div className="text-sm font-medium text-muted-foreground">{user.email}</div>
                  </div>
                  <Button variant="ghost" onClick={handleSignOut} className="ml-auto p-1">
                    <LogOut className="h-6 w-6 text-[#4f46e5]" />
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
      <main className="pt-16">
        {/* Hero Section */}
        <motion.section 
          id="hero" 
          className="flex items-center justify-center min-h-screen py-20 lg:py-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-center">
              <div className="text-container text-center lg:text-left w-full lg:w-1/2 mb-12 lg:mb-0">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
                  <span className="block">Master</span>
                  <span className="block text-[#4f46e5]">Every Aspect</span>
                  <span className="block">Of Your Memory</span>
                </h1>
                <p className="mt-4 text-lg sm:text-xl text-muted-foreground mb-8">
                  {"Nrglitch: Sharpen your mind with engaging memory exercises backed by cognitive science."}
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
              </div>
              <div className="w-full lg:w-1/2 relative">
                <Image
                  src="/hero.png"
                  alt="Illustration of various memory concepts"
                  width={1000}
                  height={1000}
                  className="w-full h-auto object-contain"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Our Story Section */}
        <motion.section 
          id="our-story" 
          ref={containerRef}
          className="py-24 overflow-hidden relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center"
            style={{ y, opacity }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/90 via-purple-50/90 to-pink-50/90" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.h2 
              className="text-5xl font-bold mb-8 text-center text-gray-900"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Our Extraordinary Journey
            </motion.h2>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <motion.div 
                className="lg:w-1/2"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Image
                  src="/placeholder.svg?height=600&width=600"
                  width={600}
                  height={600}
                  alt="Our Story"
                  className="rounded-lg shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-300"
                />
              </motion.div>

              <div className="lg:w-1/2">
                <motion.p 
                  className="text-xl mb-8 leading-relaxed text-muted-foreground"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {"Since our inception, we've been on a relentless pursuit of excellence, pushing boundaries and redefining what's possible. Our story is one of passion, perseverance, and groundbreaking innovations that have shaped industries and touched lives across the globe."}
                </motion.p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Premium Section */}
        <motion.section 
          id="premium" 
          className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Premium Access</h2>
          {user && user.hasPaid ? (
            <div className="max-w-lg mx-auto text-center">
              <h3 className="text-2xl font-bold mb-4">Welcome to Premium!</h3>
              <p className="text-muted-foreground mb-8">You have access to all premium features.</p>
              <Button
                onClick={() => router.push('/premium-tasks')}
                className="bg-gradient-to-r from-[#4f46e5] via-[#4338ca] to-[#3730a3] hover:from-[#4f46e5]/90 hover:via-[#4338ca]/90 hover:to-[#3730a3]/90 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Access Premium Tasks
              </Button>
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
                    <span className="text-xl text-muted-foreground ml-2">/ lifetime</span>
                  </div>
                  <p className="text-muted-foreground mb-8">
                    {"One-time payment for unlimited access to premium features"}
                  </p>
                  <ul className="space-y-4 mb-8">
                    {[
                      "50+ memory games covering all aspects",
                      "Advanced progress tracking and analytics",
                      "Personalized training plans",
                      "Visual memory enhancement tasks",
                      "Auditory memory improvement exercises",
                      "Ad-free experience"
                    ].map((feature, index) => (
                      <motion.li 
                        key={index}
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Check className="h-5 w-5 text-green-500" />
                        <span className="text-muted-foreground">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <Button
                    onClick={handleUpgradeClick}
                    className="w-full bg-gradient-to-r from-[#4f46e5] via-[#4338ca] to-[#3730a3] hover:from-[#4f46e5]/90 hover:via-[#4338ca]/90 hover:to-[#3730a3]/90 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Upgrade Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.section>

        {/* Memory Types Section */}
        <motion.section 
          id="memory-types" 
          className="py-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Types of Memory</h2>
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
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.section>

        {/* FAQ Section  */}
        <motion.section 
          id="faq" 
          className="py-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Frequently Asked Questions</h2>
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
                          <p className="text-muted-foreground">{item.answer}</p>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              ))}
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-[#4f46e5] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-8">
            <Link href="/" className="flex items-center">
              <Brain className="h-8 w-auto sm:h-10 text-white" />
              <span className="ml-2 text-2xl font-bold">Nrglitch</span>
            </Link>
            <nav className="flex flex-wrap justify-center gap-6">
              <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20" onClick={handleStartTest}>
                <Play className="h-5 w-5 mr-2" />
                Start the Test
              </Button>
              <Link href="#premium" passHref>
                <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Premium
                </Button>
              </Link>
              <Link href="#our-story" passHref>
                <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Our Story
                </Button>
              </Link>
              <Link href="#contact" passHref>
                <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20">
                  <Mail className="h-5 w-5 mr-2" />
                  Contact
                </Button>
              </Link>
            </nav>
          </div>
          <div className="mt-8 border-t border-white/20 pt-8 text-center">
            <p className="text-white/80">&copy; 2023 Nrglitch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}