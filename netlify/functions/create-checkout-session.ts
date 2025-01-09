import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { planId, userId } = JSON.parse(event.body || '{}');

    // Validate user and plan
    const [{ data: user }, { data: plan }] = await Promise.all([
      supabase.auth.admin.getUserById(userId),
      supabase.from('subscription_plans').select('*').eq('id', planId).single()
    ]);

    if (!user?.user || !plan) {
      return { 
        statusCode: 404, 
        body: JSON.stringify({ error: 'User or plan not found' })
      };
    }

    // Create or get customer
    let customerId = user.user.user_metadata.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.user.email,
        metadata: { user_id: userId }
      });
      customerId = customer.id;
      
      await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { stripe_customer_id: customerId }
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: plan.stripe_price_id, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL}/subscription`,
      metadata: { user_id: userId, plan_id: planId }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId: session.id })
    };
  } catch (error) {
    console.error('Checkout error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: (error as Error).message })
    };
  }
};