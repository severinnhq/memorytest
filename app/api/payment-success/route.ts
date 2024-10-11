import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not successful' }, { status: 400 })
    }

    const userId = session.metadata?.userId || session.client_reference_id

    if (!userId) {
      return NextResponse.json({ error: 'User ID not found in session metadata' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("memento")

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { hasPaid: true } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (result.modifiedCount === 1) {
      return NextResponse.json({ status: 'success', message: 'Payment status updated successfully' })
    } else {
      return NextResponse.json({ status: 'error', error: 'Failed to update payment status' }, { status: 400 })
    }
  } catch (error: unknown) {
    console.error('Error processing payment success:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return NextResponse.json({ status: 'error', error: 'Internal Server Error', details: errorMessage }, { status: 500 })
  }
}