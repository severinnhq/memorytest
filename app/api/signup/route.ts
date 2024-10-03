import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { User } from '@/lib/mongodb'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()
    const client = await clientPromise
    const db = client.db("memento")

    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
    }

    const result = await db.collection("users").insertOne({
      name,
      email,
      password,  // In a real app, hash this password before storing
      hasPaid: false
    })

    const user: User = {
      _id: result.insertedId.toString(),
      name,
      email,
      hasPaid: false
    }

    return NextResponse.json({ user })
  } catch (e) {
    console.error('Sign up error:', e)
    return NextResponse.json({ error: 'An error occurred during sign up' }, { status: 500 })
  }
}