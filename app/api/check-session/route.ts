import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(req: NextRequest) {
  try {
    const { db } = await connectToDatabase()

    // Get the session ID from the cookie
    const sessionId = req.cookies.get('sessionId')?.value

    if (!sessionId) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 })
    }

    // Find the session in the 'sessions' collection
    const session = await db.collection('sessions').findOne({ _id: new ObjectId(sessionId) })

    if (!session || new Date() > new Date(session.expiresAt)) {
      // Session not found or expired
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 })
    }

    // Find the user associated with the session in the 'users' collection
    const user = await db.collection('users').findOne({ _id: new ObjectId(session.userId) })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Return the user data (excluding sensitive information like password)
    return NextResponse.json({
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        hasPaid: user.hasPaid
      }
    })
  } catch (error) {
    console.error('Check session error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}