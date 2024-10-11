import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    const body = await req.text()
    const sig = req.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch (err) {
      console.error(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
      return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        // Update user's payment status
        await updateUserPaymentStatus(session)
        break
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
  }
}

async function updateUserPaymentStatus(session: Stripe.Checkout.Session) {
  // Implement your logic to update the user's payment status
  // You might want to use the session.client_reference_id to identify the user
  console.log('Updating payment status for session:', session.id)
}