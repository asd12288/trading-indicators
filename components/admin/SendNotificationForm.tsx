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
} from "lucide-react";
import supabaseClient from "@/database/supabase/supabase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function SendNotificationForm() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notificationType, setNotificationType] = useState<string>("system");
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

  // Function to send notification to all users
  const sendNotificationToAllUsers = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in the required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      // Get all users
      const { data: users, error: usersError } = await supabaseClient
        .from("profiles")
        .select("id")
        .not("id", "is", null);

      if (usersError)
        throw new Error(`Failed to fetch users: ${usersError.message}`);

      if (!users || users.length === 0) {
        throw new Error("No users found in the database");
      }

      // Prepare additional data
      const additionalData: any = {
        admin_generated: true,
        priority: priority,
      };

      // Add link text to additional data as fallback
      if (addLink && linkText) {
        additionalData.link_text = linkText;
      }

      if (expiresAfter !== "never") {
        const expiryDays = parseInt(expiresAfter);
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + expiryDays);
        additionalData.expires_at = expiryDate.toISOString();
      }

      // Create notifications with corrected timestamp (adding 2 hours)
      const currentTime = new Date();
      currentTime.setHours(currentTime.getHours() + 2); // Add 2 hours to fix timezone issue

      console.log(
        "Setting notification timestamp to:",
        currentTime.toISOString(),
      );

      const { data, error } = await supabaseClient.rpc(
        "create_manual_notifications",
        {
          p_title: title,
          p_message: message,
          p_type: notificationType,
          p_link: addLink && link ? link : null,
          p_link_text: addLink && linkText ? linkText : null,
          p_additional_data: additionalData,
          p_created_at: currentTime.toISOString(), // Use the adjusted time
        },
      );

      if (error)
        throw new Error(`Failed to create notifications: ${error.message}`);

      setStatus({
        type: "success",
        message: `Success! Sent to ${data || users.length} users.`,
      });

      toast({
        title: "Notifications Sent",
        description: `Successfully sent to ${data || users.length} users.`,
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
        return <Bell className="h-4 w-4 text-orange-400" />;
      case "account":
        return <User className="h-4 w-4 text-blue-400" />;
      case "admin":
        return <ShieldAlert className="h-4 w-4 text-purple-400" />;
      case "system":
      default:
        return <Info className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <Card className="border-slate-700 bg-slate-800/60">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-white">
              Send Notifications
            </CardTitle>
            <CardDescription className="mt-1">
              Create and send notifications to all users in the system
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-slate-700 px-2 text-slate-300">
            Admin Only
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="bg-slate-700">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
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

            <div className="grid gap-6">
              {/* Notification Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-300">
                  Notification Type
                </Label>
                <Select
                  value={notificationType}
                  onValueChange={setNotificationType}
                >
                  <SelectTrigger className="border-slate-700 bg-slate-900">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-700 bg-slate-900">
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                    <SelectItem value="account">Account</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
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
                  className="border-slate-700 bg-slate-900"
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
                  className="border-slate-700 bg-slate-900"
                  required
                />
                <p className="text-xs text-slate-500">
                  Clear, concise message that will be shown to all users
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div className="grid gap-6">
              {/* Priority */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-300">
                  Priority
                </Label>
                <RadioGroup
                  value={priority}
                  onValueChange={setPriority}
                  className="flex space-x-2"
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

              {/* Expiry option */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-300">
                  Notification Expiry
                </Label>
                <Select value={expiresAfter} onValueChange={setExpiresAfter}>
                  <SelectTrigger className="border-slate-700 bg-slate-900">
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
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <div className="rounded-lg border border-slate-600 bg-slate-900 p-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-slate-300">
                  Notification Preview
                </h3>
                <p className="text-xs text-slate-500">
                  This is how your notification will appear to users
                </p>
              </div>

              {/* Notification preview */}
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
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between border-t border-slate-700 pt-4">
        <div className="text-sm text-slate-400">
          <span className="text-slate-300">
            {title.length > 0 && message.length > 0 ? "✓" : "○"}
          </span>{" "}
          Required fields filled
        </div>
        <Button
          onClick={sendNotificationToAllUsers}
          disabled={isSubmitting || !title.trim() || !message.trim()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" /> Send to All Users
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
