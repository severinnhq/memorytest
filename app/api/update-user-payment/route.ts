import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(req: Request) {
  try {
    const { userId, hasPaid } = await req.json()

    const client = await clientPromise
    const db = client.db("memento")

    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { hasPaid: hasPaid } }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating user payment status:', error)
    return NextResponse.json({ error: 'Failed to update user payment status' }, { status: 500 })
  }
}