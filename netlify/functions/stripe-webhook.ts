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
  try {
    const signature = event.headers['stripe-signature']!;
    const event_data = stripe.webhooks.constructEvent(
      event.body!,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event_data.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event_data.data.object as Stripe.Subscription;
        await supabase.from('subscriptions').upsert({
          user_id: subscription.metadata.user_id,
          stripe_subscription_id: subscription.id,
          status: subscription.status,
          plan_id: subscription.metadata.plan_id,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event_data.data.object as Stripe.Subscription;
        await supabase.from('subscriptions')
          .update({ status: 'canceled' })
          .match({ stripe_subscription_id: subscription.id });
        break;
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: (error as Error).message })
    };
  }
};