"use client"

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-indigo-800 mb-2">Memory Enhancement Tasks</h1>
        <p className="text-xl text-indigo-600">Challenge your mind and improve your memory</p>
      </motion.div>
      <div className="space-y-4 w-full max-w-md">
        
        <Link href="/mid-tasks" className="w-full">
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg">
            Start Mid-Level Tasks
          </Button>
        </Link>
        <Link href="/advanced-tasks" className="w-full">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">
            Start Advanced Tasks
          </Button>
        </Link>
      </div>
    </div>
  )
}