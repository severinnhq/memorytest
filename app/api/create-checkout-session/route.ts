import { NextResponse } from 'next/server'
import stripe from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

    if (!baseUrl) {
      throw new Error('NEXT_PUBLIC_BASE_URL is not set in the environment variables')
    }

    // Replace with your actual price ID
    const priceId = process.env.STRIPE_PRICE_ID

    if (!priceId) {
      throw new Error('STRIPE_PRICE_ID is not set in the environment variables')
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/payment-cancel`,
      client_reference_id: userId,
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (err: any) {
    console.error('Error creating checkout session:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}