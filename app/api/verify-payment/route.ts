import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'No session ID provided' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("memento")

    const paymentRecord = await db.collection("payments").findOne({ sessionId })

    if (!paymentRecord) {
      return NextResponse.json({ success: false, error: 'Payment record not found' }, { status: 404 })
    }

    // Verify the payment status with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === 'paid') {
      // Update the user's payment status
      await db.collection("users").updateOne(
        { _id: paymentRecord.userId },
        { $set: { hasPaid: true } }
      )

      // Update the payment record
      await db.collection("payments").updateOne(
        { sessionId },
        { $set: { status: 'completed' } }
      )

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: 'Payment not completed' }, { status: 400 })
    }
  } catch (error: unknown) {
    console.error('Error verifying payment:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return NextResponse.json({ success: false, error: 'Internal Server Error', details: errorMessage }, { status: 500 })
  }
}