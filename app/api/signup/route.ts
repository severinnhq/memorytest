import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { User, UserCollection } from '@/models/User'
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    // Check if user already exists
    const existingUser = await db.collection<User>(UserCollection).findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser: Omit<User, '_id'> = {
      name,
      email,
      password: hashedPassword,
    }

    const result = await db.collection<User>(UserCollection).insertOne(newUser as User)

    return NextResponse.json({ message: 'User created successfully', userId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error('Sign up error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}