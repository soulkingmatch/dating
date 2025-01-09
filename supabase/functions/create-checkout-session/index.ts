import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import Stripe from 'https://esm.sh/stripe@13.10.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
)

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { planId, userId } = await req.json()

    // Validate user and plan
    const [{ data: user }, { data: plan }] = await Promise.all([
      supabase.auth.admin.getUserById(userId),
      supabase.from('subscription_plans').select('*').eq('id', planId).single()
    ])

    if (!user?.user) {
      return new Response('User not found', { status: 404 })
    }

    if (!plan) {
      return new Response('Plan not found', { status: 404 })
    }

    // Get or create customer
    let customerId = user.user.user_metadata.stripe_customer_id
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.user.email,
        metadata: { user_id: userId }
      })
      customerId = customer.id
      
      await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { stripe_customer_id: customerId }
      })
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.stripe_price_id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/pricing`,
      metadata: {
        user_id: userId,
        plan_id: planId
      }
    })

    return new Response(JSON.stringify({ sessionId: session.id }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})