import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()
    const client = await clientPromise
    const db = client.db("memento")

    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
    }

    await db.collection("users").insertOne({
      name,
      email,
      password,  // In a real app, hash this password before storing
    })

    return NextResponse.json({ 
      user: { 
        name,
        email 
      } 
    })
  } catch (e) {
    console.error('Sign up error:', e)
    return NextResponse.json({ error: 'An error occurred during sign up' }, { status: 500 })
  }
}