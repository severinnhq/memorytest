import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    const client = await clientPromise
    const db = client.db("memento")

    const user = await db.collection("users").findOne({ email })

    if (user && user.password === password) {  // In a real app, use proper password hashing
      console.log('User found:', user)  // Log for debugging
      return NextResponse.json({ 
        user: { 
          name: user.name || email.split('@')[0], // Use email username if name is not available
          email: user.email 
        } 
      })
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
  } catch (e) {
    console.error('Sign in error:', e)
    return NextResponse.json({ error: 'An error occurred during sign in' }, { status: 500 })
  }
}