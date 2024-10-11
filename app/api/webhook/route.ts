import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const sig = headers().get('stripe-signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session
      await updateUserPaymentStatus(session)
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

async function updateUserPaymentStatus(session: Stripe.Checkout.Session) {
  const userId = session.client_reference_id || session.metadata?.userId

  if (!userId) {
    console.error('User ID not found in session metadata')
    return
  }

  const client = await clientPromise
  const db = client.db("memento")

  try {
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { hasPaid: true } }
    )

    if (result.matchedCount === 0) {
      console.error('User not found:', userId)
    } else if (result.modifiedCount === 1) {
      console.log('Payment status updated successfully for user:', userId)
    } else {
      console.log('Payment status was already updated for user:', userId)
    }
  } catch (error) {
    console.error('Error updating payment status:', error)
  }
}