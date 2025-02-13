import { createClient } from "@/database/supabase/server";
import {
  CustomerCreatedEvent,
  CustomerUpdatedEvent,
  EventEntity,
  EventName,
  SubscriptionCreatedEvent,
  SubscriptionUpdatedEvent,
  SubscriptionActivatedEvent,
  SubscriptionCanceledEvent,
} from "@paddle/paddle-node-sdk";

export class ProcessWebhook {
  async processEvent(eventData: EventEntity) {
    switch (eventData.eventType) {
      case EventName.SubscriptionCreated:
      case EventName.SubscriptionUpdated:
      case EventName.SubscriptionActivated:
        await this.updateSubscriptionData(eventData);
        break;
      case EventName.CustomerCreated:
      case EventName.CustomerUpdated:
        await this.updateCustomerData(eventData);
        break;
      case EventName.SubscriptionCanceled:
        await this.handleSubscriptionCanceled(eventData);
        break;
    }
  }

  private async updateSubscriptionData(
    eventData:
      | SubscriptionCreatedEvent
      | SubscriptionUpdatedEvent
      | SubscriptionActivatedEvent,
  ) {
    try {
      console.log(eventData);
      const supabase = await createClient();

      const userId = eventData.data.customData?.userId;
      if (!userId) {
        throw new Error("User ID not found in subscription data");
      }

      const { data: planUpdateData, error: planUpdateError } = await supabase
        .from("profiles")
        .update({
          id: userId,
          plan: "pro",
          subscription_id: eventData.data.id,
          subscription_status: eventData.data.status,
          price_id: eventData.data.items[0].price?.id ?? "",
          product_id: eventData.data.items[0].price?.productId ?? "",
          scheduled_change: eventData.data.scheduledChange?.effectiveAt,
          customer_id: eventData.data.customerId,
        })
        .eq("id", userId);

      if (planUpdateError) {
        console.error("Error updating user plan:", planUpdateError);
      } else {
        console.log("User plan updated to pro:", planUpdateData);
      }
    } catch (e) {
      console.error(e);
    }
  }

  private async updateCustomerData(
    eventData: CustomerCreatedEvent | CustomerUpdatedEvent,
  ) {
    try {
      const supabase = await createClient();
      const response = await supabase
        .from("customers")
        .upsert({
          customer_id: eventData.data.id,
          email: eventData.data.email,
        })
        .select();
      console.log(response);
    } catch (e) {
      console.error(e);
    }
  }

  private async handleSubscriptionCanceled(eventData: SubscriptionCanceledEvent) {
    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from("profiles")
        .update({
          plan: "free",
          subscription_status: "canceled",
          scheduled_change: null,
        })
        .eq("subscription_id", eventData.data.id);

      if (error) {
        console.error("Error updating profile on cancellation:", error);
      }
    } catch (e) {
      console.error("Error handling subscription cancellation:", e);
    }
  }
}


