import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import stripe from '@/lib/stripe'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = headers().get('stripe-signature') as string

  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any

    const client = await clientPromise
    const db = client.db("memento")

    await db.collection("users").updateOne(
      { _id: new ObjectId(session.client_reference_id) },
      { $set: { hasPaid: true } }
    )
  }

  return NextResponse.json({ received: true })
}

export const config = {
  api: {
    bodyParser: false,
  },
}