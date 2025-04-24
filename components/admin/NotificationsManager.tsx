"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@supabase/supabase-js";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Send, BellRing, Users, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// Form schema
const notificationSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  body: z.string().optional(),
  type: z.enum(["system", "news", "alert", "signal"]),
  url: z.string().optional(),
  sendToAll: z.boolean().default(true),
  selectedUsers: z.array(z.string()).optional(),
});

type NotificationFormValues = z.infer<typeof notificationSchema>;

export default function NotificationsManager() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<{ id: string; email: string }[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [activeTab, setActiveTab] = useState("send");
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: "",
      body: "",
      type: "system",
      url: "",
      sendToAll: true,
      selectedUsers: [],
    },
  });

  const sendToAll = form.watch("sendToAll");

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email")
        .order("email");

      if (error) {
        console.error("Error fetching users:", error);
        return;
      }

      setUsers(data || []);
    };

    fetchUsers();
  }, []);

  // Fetch recent notifications for history tab
  useEffect(() => {
    if (activeTab === "history") {
      fetchRecentNotifications();
    }
  }, [activeTab]);

  const fetchRecentNotifications = async () => {
    setLoadingHistory(true);

    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      setRecentNotifications(data || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      toast({
        title: "Error",
        description: "Failed to load notification history",
        variant: "destructive",
      });
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleUserSelection = (userId: string) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(userSearch.toLowerCase()),
  );

  const onSubmit = async (values: NotificationFormValues) => {
    setLoading(true);

    try {
      // Determine recipient users
      let targetUsers: string[] = [];

      if (values.sendToAll) {
        targetUsers = users.map((user) => user.id);
      } else {
        targetUsers = selectedUsers;
      }

      if (targetUsers.length === 0) {
        toast({
          title: "Error",
          description: "No recipients selected",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Create notification records
      const notifications = targetUsers.map((userId) => ({
        user_id: userId,
        title: values.title,
        body: values.body || null,
        type: values.type,
        url: values.url || null,
        is_read: false,
      }));

      const { error } = await supabase
        .from("notifications")
        .insert(notifications);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Notification sent to ${targetUsers.length} ${targetUsers.length === 1 ? "user" : "users"}`,
      });

      // Reset form
      form.reset();
      setSelectedUsers([]);
    } catch (err) {
      console.error("Error sending notifications:", err);
      toast({
        title: "Error",
        description: "Failed to send notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "system":
        return "bg-purple-900/20 text-purple-400";
      case "news":
        return "bg-blue-900/20 text-blue-400";
      case "alert":
        return "bg-amber-900/20 text-amber-400";
      case "signal":
        return "bg-cyan-900/20 text-cyan-400";
      default:
        return "bg-slate-700/30 text-slate-400";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-200">
        Notification Management
      </h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="send">Send Notifications</TabsTrigger>
          <TabsTrigger value="history">Notification History</TabsTrigger>
        </TabsList>

        <TabsContent value="send">
          <Card className="border-slate-700 bg-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-200">
                Send Notifications
              </CardTitle>
              <CardDescription>
                Create and send notifications to selected users or to everyone
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-50">Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Notification title"
                              className="border-slate-700 bg-slate-900 text-slate-200"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-50">Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="border-slate-700 bg-slate-900 text-slate-200">
                                <SelectValue placeholder="Select notification type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="border-slate-700 bg-slate-800">
                              <SelectItem value="system">System</SelectItem>
                              <SelectItem value="news">News</SelectItem>
                              <SelectItem value="alert">Alert</SelectItem>
                              <SelectItem value="signal">Signal</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="body"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-50">
                          Message (optional)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Notification message content"
                            className="min-h-[100px] border-slate-700 bg-slate-900 text-slate-200"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-50">
                          URL (optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="/smart-alerts/EURUSD"
                            className="border-slate-700 bg-slate-900 text-slate-200"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-slate-400">
                          Add a URL to link this notification to a specific page
                          (e.g. /smart-alerts/EURUSD)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sendToAll"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border border-slate-700 p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-slate-300">
                            Send to all users
                          </FormLabel>
                          <FormDescription className="text-slate-400">
                            When enabled, the notification will be sent to all
                            users
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {!sendToAll && (
                    <div className="space-y-4 rounded-md border border-slate-700 p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-slate-300">
                            Select Recipients
                          </h4>
                          <Badge
                            variant="secondary"
                            className="bg-slate-700 text-slate-300"
                          >
                            {selectedUsers.length} selected
                          </Badge>
                        </div>

                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                          <Input
                            placeholder="Search users by email..."
                            className="border-slate-700 bg-slate-900 pl-8 text-slate-200"
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="max-h-64 overflow-y-auto rounded-md border border-slate-700 bg-slate-900 p-1">
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center space-x-2 rounded-sm p-2 hover:bg-slate-800"
                            >
                              <Checkbox
                                id={user.id}
                                checked={selectedUsers.includes(user.id)}
                                onCheckedChange={() =>
                                  handleUserSelection(user.id)
                                }
                              />
                              <label
                                htmlFor={user.id}
                                className="flex-1 cursor-pointer text-sm text-slate-300"
                              >
                                {user.email}
                              </label>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-sm text-slate-400">
                            No users found
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Sending
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> Send Notification
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="border-slate-700 bg-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-200">
                Recent Notifications
              </CardTitle>
              <CardDescription>
                View recently sent notifications (last 50)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingHistory ? (
                <div className="flex h-64 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                </div>
              ) : recentNotifications.length > 0 ? (
                <div className="max-h-[600px] space-y-4 overflow-y-auto pr-2">
                  {recentNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="rounded-lg border border-slate-700 bg-slate-900/50 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 rounded-full p-2 ${getTypeColor(notif.type)}`}
                        >
                          <BellRing className="h-4 w-4" />
                        </div>

                        <div className="flex-1">
                          <div className="mb-2 flex items-center justify-between">
                            <h4 className="font-medium text-slate-200">
                              {notif.title}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {notif.type}
                            </Badge>
                          </div>

                          {notif.body && (
                            <p className="mb-2 text-sm text-slate-400">
                              {notif.body}
                            </p>
                          )}

                          {notif.url && (
                            <div className="mb-2 inline-block rounded bg-slate-700/30 px-2 py-1 text-xs text-slate-300">
                              URL: {notif.url}
                            </div>
                          )}

                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>User ID: {notif.user_id}</span>
                            <span>{formatDate(notif.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-64 flex-col items-center justify-center text-slate-400">
                  <BellRing className="mb-4 h-12 w-12 opacity-20" />
                  <p>No notifications found</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end border-t border-slate-700 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchRecentNotifications}
                disabled={loadingHistory}
              >
                {loadingHistory ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Refreshing
                  </>
                ) : (
                  <>Refresh</>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
