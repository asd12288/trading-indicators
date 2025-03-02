"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { useTranslations } from "next-intl";

const formSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email(),
  message: z.string().nonempty(),
  title: z.string().nonempty(),
});

const ContactForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      title: "",
    },
  });

  const t = useTranslations("HomePage.contactForm");

  const [success, setSuccess] = useState(false);
  const [loading, setIsLoading] = useState(false);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Something went wrong sending the email");
      }
      setSuccess(true);
      form.reset();
    } catch (error) {
      console.error(error);
      setSuccess(false);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }

    // email logic here

    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-md  space-y-4 rounded-lg bg-slate-800 p-8 md:w-[500px]"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("name")}</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} required typeof="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("title.position")}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Trader" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900">
                        <SelectItem value="trader">
                          {t("title.option1")}
                        </SelectItem>
                        <SelectItem value="investor">
                          {" "}
                          {t("title.option2")}
                        </SelectItem>
                        <SelectItem value="broker">
                          {" "}
                          {t("title.option3")}
                        </SelectItem>
                        <SelectItem value="other">
                          {" "}
                          {t("title.option4")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("message")}</FormLabel>
              <FormControl>
                <Textarea placeholder="Message" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{loading ? "Sending" : "Send Message"}</Button>
        {success && (
          <p className="text-center text-sm text-green-500">
            {t("feedback.success")}
          </p>
        )}
      </form>
    </Form>
  );
};

export default ContactForm;
