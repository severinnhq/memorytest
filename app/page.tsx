'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, Check, Star } from "lucide-react"
import Link from 'next/link'

export default function LandingPage() {
  const [isSticky, setIsSticky] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.8])
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.9])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isSticky ? 'bg-white/80 backdrop-blur-md shadow-md' : ''
        }`}
        style={{ opacity: headerOpacity }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            PremiumUI
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
          </nav>
          <Button>Get Started</Button>
        </div>
      </motion.header>

      <motion.section
        className="pt-32 pb-16 md:pt-40 md:pb-24"
        style={{ scale: heroScale }}
      >
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <motion.h1
              className="text-5xl md:text-6xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Elevate Your Digital Experience
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Create stunning interfaces with our premium UI components and design system.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button size="lg" className="mr-4">
                Get Started <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </motion.div>
          </div>
          <div className="md:w-1/2">
            <motion.div
              className="w-full h-96 bg-gradient-to-br from-primary to-purple-600 rounded-2xl shadow-2xl"
              initial={{ rotateY: 45, rotateX: 45, rotateZ: -5 }}
              animate={{ rotateY: 0, rotateX: 0, rotateZ: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.section>

      <section id="features" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Responsive Design", description: "Fully responsive components that look great on any device." },
              { title: "Customizable", description: "Easily customize and extend components to fit your needs." },
              { title: "Accessible", description: "Built with accessibility in mind, following WCAG guidelines." },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-md p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Our Customers Say</h2>
          <Tabs defaultValue="tab1" className="w-full max-w-3xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tab1">Sarah J.</TabsTrigger>
              <TabsTrigger value="tab2">Mike T.</TabsTrigger>
              <TabsTrigger value="tab3">Emily R.</TabsTrigger>
            </TabsList>
            {["tab1", "tab2", "tab3"].map((tab, index) => (
              <TabsContent key={tab} value={tab}>
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Testimonial</CardTitle>
                    <CardDescription>Hear from our satisfied clients</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 italic">
                      "PremiumUI has revolutionized our design process. The components are not only beautiful but also
                      highly functional and easy to implement. It's a game-changer for our team!"
                    </p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary rounded-full mr-3" />
                      <div>
                        <p className="font-semibold">Customer {index + 1}</p>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <section id="pricing" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Starter", price: "$49", features: ["100+ Components", "Basic Support", "1 Project"] },
              { name: "Pro", price: "$99", features: ["200+ Components", "Priority Support", "Unlimited Projects"] },
              { name: "Enterprise", price: "Custom", features: ["Custom Components", "24/7 Support", "Dedicated Account Manager"] },
            ].map((plan, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-4">{plan.name}</h3>
                  <p className="text-4xl font-bold mb-6">{plan.price}</p>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="w-5 h-5 text-primary mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={index === 1 ? "default" : "outline"}>
                    Choose Plan
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of developers and designers who are already using PremiumUI to create stunning interfaces.
          </p>
          <Button size="lg">
            Get Started Now <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Community</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p>&copy; {new Date().getFullYear()} PremiumUI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}