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
  try {
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      return new Response('Missing signature', { status: 400 })
    }

    const body = await req.text()
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
    )

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object
        await supabase.from('subscriptions').upsert({
          user_id: subscription.metadata.user_id,
          stripe_subscription_id: subscription.id,
          status: subscription.status,
          plan_id: subscription.metadata.plan_id,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end
        })
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object
        // Instead of deleting, mark as canceled
        await supabase.from('subscriptions')
          .update({ status: 'canceled' })
          .match({ stripe_subscription_id: deletedSubscription.id })
        break
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Webhook error:', error.message)
    return new Response(`Webhook Error: ${error.message}`, { status: 400 })
  }
})