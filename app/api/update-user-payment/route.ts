import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(req: NextRequest) {
  try {
    const { userId, hasPaid } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("memento")

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { hasPaid: hasPaid } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (result.modifiedCount === 1) {
      return NextResponse.json({ message: 'Payment status updated successfully' })
    } else {
      return NextResponse.json({ error: 'Failed to update payment status' }, { status: 400 })
    }
  } catch (error: unknown) {
    console.error('Error updating user payment status:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 })
  }
}