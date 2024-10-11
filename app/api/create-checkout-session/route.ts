import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { baseUrl } from '../../config'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
})

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      console.log('User ID is missing')
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    console.log('Creating checkout session for user:', userId)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Nrglitch Premium',
            },
            unit_amount: 50, // 0.50 EUR in cents (minimum amount required by Stripe)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/`,
      metadata: {
        userId: userId,
      },
      client_reference_id: userId,
    })

    console.log('Checkout session created:', session.id)

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}