import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { hash } from 'bcrypt'
// import { ObjectId } from 'mongodb'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()
    const { db } = await connectToDatabase()

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Hash the password
    const hashedPassword = await hash(password, 12)

    // Create a new user
    const newUser = {
      name,
      email,
      password: hashedPassword,
      hasPaid: false,
    }

    // Insert the new user into the 'users' collection
    const result = await db.collection('users').insertOne(newUser)

    // Create a session
    const session = {
      userId: result.insertedId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    }

    // Insert the session into the 'sessions' collection
    const sessionResult = await db.collection('sessions').insertOne(session)

    // Set the session cookie
    const response = NextResponse.json({
      user: { _id: result.insertedId.toString(), name: newUser.name, email: newUser.email, hasPaid: newUser.hasPaid },
      message: 'User created successfully'
    }, { status: 201 })

    response.cookies.set('sessionId', sessionResult.insertedId.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}