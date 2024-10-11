import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { config } from '@/app/config'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
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
        success_url: `${config.baseUrl}/payment-success`,
        cancel_url: `${config.baseUrl}/payment-cancelled`,
        client_reference_id: userId,
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