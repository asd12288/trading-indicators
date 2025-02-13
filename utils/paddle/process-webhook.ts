import { createClient } from "@/database/supabase/server";
import {
  CustomerCreatedEvent,
  CustomerUpdatedEvent,
  EventEntity,
  EventName,
  SubscriptionCreatedEvent,
  SubscriptionUpdatedEvent,
  SubscriptionActivatedEvent,
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
        .update({ plan: "pro" })
        .eq("id", userId);

      if (planUpdateError) {
        console.error("Error updating user plan:", planUpdateError);
      } else {
        console.log("User plan updated to pro:", planUpdateData);
      }
      const response = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          subscription_id: eventData.data.id,
          subscription_status: eventData.data.status,
          price_id: eventData.data.items[0].price?.id ?? "",
          product_id: eventData.data.items[0].price?.productId ?? "",
          scheduled_change: eventData.data.scheduledChange?.effectiveAt,
          customer_id: eventData.data.customerId,
        })
        .select();
      console.log(response);
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
}
