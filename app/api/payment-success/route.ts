import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import stripe from '@/lib/stripe'
import { ObjectId } from 'mongodb'

export async function POST(request: Request) {
  try {
    const { session_id } = await request.json()

    const session = await stripe.checkout.sessions.retrieve(session_id)
    const userId = session.client_reference_id

    if (!userId) {
      throw new Error('No user ID found in session')
    }

    const client = await clientPromise
    const db = client.db("memento")

    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { hasPaid: true } }
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error processing payment success:', err)
    return NextResponse.json({ error: 'Error processing payment success' }, { status: 500 })
  }
}