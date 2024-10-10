import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { User, UserCollection } from '@/models/User'
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const client = await clientPromise
    const db = client.db()

    const user = await db.collection<User>(UserCollection).findOne({ email })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // You might want to create a session or JWT token here

    return NextResponse.json({ message: 'Sign in successful', user: { id: user._id, name: user.name, email: user.email } })
  } catch (error) {
    console.error('Sign in error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}