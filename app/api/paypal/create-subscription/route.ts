// app/api/paypal/create-subscription/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createSubscription } from '@/lib/paypal';

export async function POST(req) {
  // 1. Initialize Supabase client with Service Role Key
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  // 2. Extract and verify the user's JWT from the Authorization header
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '').trim();

  // Verify the token and retrieve user information
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = user.id;

  try {
    // 3. Create PayPal subscription via PayPal API
    const planId = process.env.PAYPAL_PLAN_ID;

    console.log('Using PayPal Plan ID:', planId);

    const paypalResponse = await createSubscription(planId, null, userId);
    const subscriptionId = paypalResponse.id; // PayPal subscription ID (e.g., "I-ABC123XYZ")

    // 4. Store subscription initial record in Supabase
    await supabase.from('subscriptions').insert({
      id: subscriptionId,
      user_id: userId,
      plan_id: planId,
      status: paypalResponse.status || 'APPROVAL_PENDING', // PayPal might return 'APPROVAL_PENDING'
      start_time: paypalResponse.start_time || new Date().toISOString(),
    });

    // 5. Return the subscription ID to the client
    return NextResponse.json({ id: subscriptionId });
  } catch (err) {
    console.error('Create Subscription error:', err);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}
