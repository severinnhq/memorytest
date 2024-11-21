import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { config } from '@/app/config'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia', // Use the exact expected version string
})

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    try {
      const { userId } = await req.json()

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Nrglitch Premium',
                description: 'Lifetime access to all premium features',
              },
              unit_amount: 50, // €0.50 in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${config.baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.baseUrl}/payment-cancelled`,
        client_reference_id: userId,
      })

      // Store the session ID in the database
      const client = await clientPromise
      const db = client.db("memento")
      await db.collection("payments").insertOne({
        userId: new ObjectId(userId),
        sessionId: session.id,
        status: 'pending',
        createdAt: new Date()
      })

      return NextResponse.json({ sessionId: session.id })
    } catch (err) {
      console.error('Error creating checkout session:', err)
      return NextResponse.json({ error: 'Error creating checkout session' }, { status: 500 })
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
  }
}