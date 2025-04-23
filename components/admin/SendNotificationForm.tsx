"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  AlertTriangle,
  CheckCircle,
  Loader2,
  Bell,
  User,
  Info,
  Send,
  Link as LinkIcon,
  ExternalLink,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Eye,
  Settings,
  Sliders,
  BellRing,
  LineChart,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { createClient } from "@/database/supabase/client";
import NotificationService from "@/lib/notification-service";
import { NotificationType } from "@/types/notifications";

export default function SendNotificationForm() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notificationType, setNotificationType] =
    useState<NotificationType>("system");
  const [priority, setPriority] = useState<string>("normal");
  const [link, setLink] = useState<string>("");
  const [linkText, setLinkText] = useState<string>("");
  const [addLink, setAddLink] = useState<boolean>(false);
  const [expiresAfter, setExpiresAfter] = useState<string>("never");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [sendToSpecificUser, setSendToSpecificUser] = useState<boolean>(false);
  const [specificUserEmail, setSpecificUserEmail] = useState<string>("");

  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  // Function to send notification to all users or specific user
  const sendNotifications = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in the required fields",
        variant: "destructive",
      });
      return;
    }

    if (sendToSpecificUser && !specificUserEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter a user email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      const supabase = createClient();

      // Get users to send notifications to
      let users;

      if (sendToSpecificUser) {
        // Get the specific user by email
        const { data: userData, error: userError } = await supabase
          .from("profiles")
          .select("id, email")
          .eq("email", specificUserEmail.trim())
          .single();

        if (userError || !userData) {
          throw new Error(`User not found: ${specificUserEmail}`);
        }

        console.log("Found user:", userData);
        users = [userData];
      } else {
        // Get all users
        const { data: allUsers, error: usersError } = await supabase
          .from("profiles")
          .select("id, email")
          .not("id", "is", null);

        if (usersError)
          throw new Error(`Failed to fetch users: ${usersError.message}`);

        if (!allUsers || allUsers.length === 0) {
          throw new Error("No users found in the database");
        }

        console.log(`Found ${allUsers.length} users for notifications`);
        users = allUsers;
      }

      // Calculate expiry days
      let expiresInDays = null;
      if (expiresAfter !== "never") {
        expiresInDays = parseInt(expiresAfter);
      }

      // Set up additional data
      const additionalData: Record<string, any> = {
        admin_generated: true,
        priority: priority,
      };

      // Batch process notifications for all users
      let successCount = 0;
      let failCount = 0;

      // Process notifications in batches to prevent overloading
      for (const user of users) {
        if (!user.id) {
          console.warn("Skipping notification for user with no ID:", user);
          failCount++;
          continue;
        }

        try {
          console.log(
            `Sending ${notificationType} notification to user: ${user.id}`,
          );

          // Using the new NotificationService to create notifications
          let success = false;

          switch (notificationType) {
            case "alert":
              success = await NotificationService.createCustomNotification(
                user.id,
                title,
                message,
                "alert", // Use explicit string for notification type
                addLink ? link : null,
                addLink && linkText ? linkText : null,
                expiresInDays,
                additionalData,
              );
              break;
            case "account":
              success = await NotificationService.createCustomNotification(
                user.id,
                title,
                message,
                "account", // Use explicit string for notification type
                addLink ? link : null,
                addLink && linkText ? linkText : null,
                expiresInDays,
                additionalData,
              );
              break;
            case "trade":
              success = await NotificationService.createCustomNotification(
                user.id,
                title,
                message,
                "trade", // Use explicit string for notification type
                addLink ? link : null,
                addLink && linkText ? linkText : null,
                expiresInDays,
                additionalData,
              );
              break;
            case "info":
              success = await NotificationService.createCustomNotification(
                user.id,
                title,
                message,
                "info", // Use explicit string for notification type
                addLink ? link : null,
                addLink && linkText ? linkText : null,
                expiresInDays,
                additionalData,
              );
              break;
            case "system":
            default:
              success = await NotificationService.createCustomNotification(
                user.id,
                title,
                message,
                "system", // Use explicit string for notification type
                addLink ? link : null,
                addLink && linkText ? linkText : null,
                expiresInDays,
                additionalData,
              );
          }

          if (success) {
            console.log(`Successfully sent notification to user: ${user.id}`);
            successCount++;
          } else {
            console.error(`Failed to send notification to user: ${user.id}`);
            failCount++;
          }
        } catch (err) {
          console.error(`Failed to send notification to user ${user.id}:`, err);
          failCount++;
        }
      }

      const totalAttempted = users.length;

      if (successCount > 0) {
        setStatus({
          type: "success",
          message: `Success! Sent to ${successCount}/${totalAttempted} users${failCount > 0 ? ` (${failCount} failed)` : ""}.`,
        });

        toast({
          title: "Notifications Sent",
          description: `Successfully sent to ${successCount} users.`,
        });

        // Reset form
        setTitle("");
        setMessage("");
        setNotificationType("system");
        setPriority("normal");
        setLink("");
        setLinkText("");
        setAddLink(false);
        setExpiresAfter("never");
        setSpecificUserEmail("");
      } else {
        throw new Error(
          `Failed to send any notifications. Please check the console for more details.`,
        );
      }
    } catch (err: any) {
      console.error("Error sending notifications:", err);
      setStatus({
        type: "error",
        message: err.message || "Failed to send notifications",
      });

      toast({
        title: "Error",
        description: err.message || "Failed to send notifications",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get icon based on notification type
  const getNotificationTypeIcon = () => {
    switch (notificationType) {
      case "alert":
        return <Bell className="h-4 w-4 text-amber-400" />;
      case "account":
        return <User className="h-4 w-4 text-blue-400" />;
      case "trade":
        return <LineChart className="h-4 w-4 text-green-400" />;
      case "system":
      case "info":
      default:
        return <Info className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-rose-900/30 p-3">
            <BellRing className="h-6 w-6 text-rose-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Notifications</h1>
            <p className="text-slate-400">Send notifications to users</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-slate-700 px-2 text-slate-300">
          Admin Only
        </Badge>
      </div>

      <Card className="border-slate-700 bg-slate-800/60">
        <CardContent className="space-y-6 pt-6">
          {/* Status Alert */}
          {status.type && (
            <Alert
              className={
                status.type === "success"
                  ? "border-green-800 bg-green-900/20 text-green-400"
                  : "border-red-800 bg-red-900/20 text-red-400"
              }
            >
              {status.type === "success" ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <AlertTitle>
                {status.type === "success" ? "Success" : "Error"}
              </AlertTitle>
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}

          {/* Main Form Section */}
          <div className="bg-slate-850 rounded-md p-5">
            <h2 className="mb-4 flex items-center text-lg font-semibold text-slate-100">
              <Info className="mr-2 h-5 w-5 text-blue-400" />
              Basic Information
            </h2>

            <div className="grid gap-5">
              {/* Notification Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-300">
                  Notification Type
                </Label>
                <Select
                  value={notificationType}
                  onValueChange={(value) =>
                    setNotificationType(value as NotificationType)
                  }
                >
                  <SelectTrigger className="border-slate-700 bg-slate-900 text-slate-50">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-700 bg-slate-900">
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                    <SelectItem value="account">Account</SelectItem>
                    <SelectItem value="trade">Trade</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">
                  Determines the appearance and categorization of the
                  notification
                </p>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-300">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Enter notification title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-slate-700 bg-slate-900 text-slate-50"
                  required
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-300">
                  Message <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  placeholder="Enter your notification message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="border-slate-700 bg-slate-900 text-slate-50"
                  required
                />
                <p className="text-xs text-slate-500">
                  Clear, concise message that will be shown to users
                </p>
              </div>
            </div>
          </div>

          {/* Advanced Options - Collapsible */}
          <Collapsible
            open={advancedOpen}
            onOpenChange={setAdvancedOpen}
            className="bg-slate-850 rounded-md border border-slate-700"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="hover:bg-slate-750 flex w-full items-center justify-between rounded-md p-5 focus:outline-none"
              >
                <div className="flex items-center">
                  <Sliders className="mr-2 h-5 w-5 text-amber-400" />
                  <span className="font-semibold text-slate-100">
                    Advanced Options
                  </span>
                </div>
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">
                    Optional
                  </Badge>
                  {advancedOpen ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-5 px-5 pb-5 pt-1">
              <Separator className="mb-3 bg-slate-700" />

              {/* Send to Specific User */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium text-slate-300">
                      Send to Specific User
                    </Label>
                    <p className="text-xs text-slate-500">
                      Send to one user instead of all users
                    </p>
                  </div>
                  <Switch
                    checked={sendToSpecificUser}
                    onCheckedChange={setSendToSpecificUser}
                  />
                </div>

                {sendToSpecificUser && (
                  <div className="space-y-2 rounded-md bg-slate-900/50 p-4">
                    <Label className="text-sm font-medium text-slate-300">
                      User Email
                    </Label>
                    <Input
                      placeholder="user@example.com"
                      value={specificUserEmail}
                      onChange={(e) => setSpecificUserEmail(e.target.value)}
                      className="border-slate-700 bg-slate-900 text-slate-50"
                    />
                  </div>
                )}
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-300">
                  Priority
                </Label>
                <RadioGroup
                  value={priority}
                  onValueChange={setPriority}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="low"
                      id="low"
                      className="bg-slate-700"
                    />
                    <Label htmlFor="low" className="text-slate-400">
                      Low
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="normal"
                      id="normal"
                      className="bg-slate-700"
                    />
                    <Label htmlFor="normal" className="text-slate-300">
                      Normal
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="high"
                      id="high"
                      className="bg-slate-700"
                    />
                    <Label htmlFor="high" className="text-amber-300">
                      High
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Add Link Toggle */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium text-slate-300">
                      Include Link
                    </Label>
                    <p className="text-xs text-slate-500">
                      Add a clickable link to your notification
                    </p>
                  </div>
                  <Switch checked={addLink} onCheckedChange={setAddLink} />
                </div>

                {/* Link URL and text fields (conditionally shown) */}
                {addLink && (
                  <div className="space-y-4 rounded-md bg-slate-900/50 p-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-300">
                        Link URL
                      </Label>
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="https://example.com/page"
                          value={link}
                          onChange={(e) => setLink(e.target.value)}
                          className="border-slate-700 bg-slate-900"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-300">
                        Link Text
                      </Label>
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Click here for more details"
                          value={linkText}
                          onChange={(e) => setLinkText(e.target.value)}
                          className="border-slate-700 bg-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Expiry option */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-300">
                  Notification Expiry
                </Label>
                <Select value={expiresAfter} onValueChange={setExpiresAfter}>
                  <SelectTrigger className="border-slate-700 bg-slate-900 text-slate-50">
                    <SelectValue placeholder="Select expiry" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-700 bg-slate-900">
                    <SelectItem value="never">Never expire</SelectItem>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">
                  When the notification should automatically be removed
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Preview Section - Toggle Button + Preview Area */}
          <div className="bg-slate-850 overflow-hidden rounded-md border border-slate-700">
            <Button
              variant="ghost"
              className="hover:bg-slate-750 flex w-full items-center justify-between rounded-t-md p-5 focus:outline-none"
              onClick={() => setPreviewVisible(!previewVisible)}
            >
              <div className="flex items-center">
                <Eye className="mr-2 h-5 w-5 text-blue-400" />
                <span className="font-semibold text-slate-100">
                  Preview Notification
                </span>
              </div>
              <div className="flex items-center">
                {previewVisible ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
            </Button>

            {previewVisible && (
              <div className="p-5">
                <div className="rounded-md bg-slate-800 p-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-slate-700 p-2">
                      {getNotificationTypeIcon()}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-medium text-white">
                        {title || "Notification Title"}
                      </h3>
                      <p className="mt-1 text-sm text-slate-300">
                        {message || "Notification message will appear here"}
                      </p>
                      {addLink && link && (
                        <div className="mt-2">
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-blue-400"
                          >
                            {linkText || "Read more"}
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      <p className="mt-2 text-xs text-slate-400">Just now</p>
                      {priority === "high" && (
                        <Badge className="mt-2 border-amber-900/50 bg-amber-800/30 text-amber-300">
                          High Priority
                        </Badge>
                      )}
                    </div>
                    <div>
                      <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t border-slate-700 pt-4">
          <div className="text-sm text-slate-400">
            <span className="text-slate-300">
              {title.length > 0 && message.length > 0 ? "✓" : "○"}
            </span>{" "}
            Required fields filled
          </div>
          <Button
            onClick={sendNotifications}
            disabled={isSubmitting || !title.trim() || !message.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                {sendToSpecificUser ? "Send to User" : "Send to All Users"}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
