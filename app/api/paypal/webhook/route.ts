// app/api/paypal/webhook/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyWebhookSignature } from '@/lib/paypal';

export async function POST(req) {
  let event;
  try {
    // Get raw body for verification (Next 13 can give raw body via req.text())
    const bodyText = await req.text();
    event = JSON.parse(bodyText);
    
    // Verify PayPal webhook signature
    const isValid = await verifyWebhookSignature(event, req.headers);
    if (!isValid) {
      console.error('Invalid PayPal webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  } catch (parseErr) {
    console.error('Error parsing webhook request', parseErr);
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }

  // At this point, signature is verified
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const eventType = event.event_type;
  const sub = event.resource;    // subscription object or related resource
  const subscriptionId = sub.id;
  const userId = sub.custom_id;  // we set this in createSubscription

  try {
    if (eventType === 'BILLING.SUBSCRIPTION.ACTIVATED') {
      // Mark subscription as active
      await supabase.from('subscriptions')
        .update({ status: 'ACTIVE' })
        .eq('id', subscriptionId);
      console.log(`Subscription ${subscriptionId} activated for user ${userId}`);
    } else if (eventType === 'BILLING.SUBSCRIPTION.CANCELLED' || eventType === 'BILLING.SUBSCRIPTION.EXPIRED') {
      // Mark subscription as canceled/expired
      await supabase.from('subscriptions')
        .update({ status: 'CANCELLED' })
        .eq('id', subscriptionId);
      console.log(`Subscription ${subscriptionId} cancelled/expired for user ${userId}`);
    } else if (eventType === 'PAYMENT.SALE.COMPLETED' || eventType === 'PAYMENT.CAPTURE.COMPLETED') {
      // A payment was received (could be initial or recurring payment)
      // You might record the payment or update last payment date.
      const paymentId = sub.id;  // in this case, sub is a sale/capture resource
      console.log(`Payment received for subscription ${subscriptionId}: payment ${paymentId}`);
      // (Optional) Update subscription record with last payment timestamp or increment payment count
      await supabase.from('subscriptions')
        .update({ last_payment: new Date().toISOString() })
        .eq('id', subscriptionId);
    } 
    // ... handle other event types as needed
  } catch (dbErr) {
    console.error('Database update failed:', dbErr);
    // We still return 200 to avoid endless retries, but you might want to alert/monitor this.
  }

  return NextResponse.json({ status: 'OK' }, { status: 200 });
}
