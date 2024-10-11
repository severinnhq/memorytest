import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { compare } from 'bcrypt'
// import { ObjectId } from 'mongodb'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    const { db } = await connectToDatabase()

    // Find the user in the 'users' collection
    const user = await db.collection('users').findOne({ email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check the password
    const isPasswordValid = await compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // Create a session
    const session = {
      userId: user._id,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    }

    // Insert the session into the 'sessions' collection
    const result = await db.collection('sessions').insertOne(session)

    // Set the session cookie
    const response = NextResponse.json({
      user: { _id: user._id.toString(), name: user.name, email: user.email, hasPaid: user.hasPaid },
      message: 'User logged in successfully'
    })

    response.cookies.set('sessionId', result.insertedId.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Signin error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}