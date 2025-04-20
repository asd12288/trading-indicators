import { NextResponse } from "next/server";
import { createClient } from "@/database/supabase/server";
import { publishToQueue } from "@/lib/upstash";

/**
 * Endpoint for tracking abandoned carts and scheduling recovery actions
 */
export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const { userId, plan, provider, amount, timestamp, metadata } = body;
    
    // Validate the request
    if (!userId || !plan) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // Get Supabase client
    const supabaseClient = await createClient();
    
    // Check if user already has an abandoned cart entry
    const { data: existingCart } = await supabaseClient
      .from("abandoned_carts")
      .select("*")
      .eq("user_id", userId)
      .eq("recovered", false)
      .single();
      
    // If cart exists, update it. Otherwise insert new record
    const now = new Date().toISOString();
    let cartId;
    
    if (existingCart) {
      // Update existing cart
      const { error, data } = await supabaseClient
        .from("abandoned_carts")
        .update({
          plan_type: plan,
          payment_provider: provider,
          amount: amount,
          updated_at: now,
          metadata: metadata || existingCart.metadata
        })
        .eq("id", existingCart.id)
        .select();
      
      if (error) {
        throw error;
      }
      
      cartId = existingCart.id;
    } else {
      // Insert new abandoned cart
      const { error, data } = await supabaseClient
        .from("abandoned_carts")
        .insert({
          user_id: userId,
          plan_type: plan,
          payment_provider: provider,
          amount: amount,
          created_at: now,
          updated_at: now,
          recovery_attempts: 0,
          recovered: false,
          metadata: metadata || {}
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      cartId = data?.[0]?.id;
      
      // Get user information for the recovery email
      const { data: user } = await supabaseClient
        .from("profiles")
        .select("email, full_name")
        .eq("id", userId)
        .single();
    
      // Schedule recovery email (send first email after 1 hour)
      if (user?.email && cartId) {
        await publishToQueue(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/emails/abandoned-cart-recovery`,
          {
            cartId,
            userEmail: user.email,
            userName: user.full_name || user.email.split('@')[0],
            planType: plan,
            amount: typeof amount === 'number' ? amount.toFixed(2) : amount
          },
          { delay: 60 * 60 } // 1 hour delay
        );
      }
    }
    
    // Return success with cart ID
    return NextResponse.json({ 
      success: true,
      cartId
    });
    
  } catch (error) {
    console.error("Failed to track abandoned cart:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}