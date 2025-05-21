"use client";

import supabaseClient from "@/database/supabase/client";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  title: z.string(),
  content: z.string(),
  subTitle: z.string(),
  imageUrl: z.any().optional(),
});

const AddPostForm = ({
  data = {},
  onSuccess,
}: {
  data?: Partial<z.infer<typeof formSchema>>;
  onSuccess?: () => void;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data.title || "",
      content: data.content || "",
      subTitle: data.subTitle || "",
      imageUrl: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let imageUrl = "";
      const file = values.imageUrl?.[0];

      if (file) {
        const fileName = `${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabaseClient.storage
          .from("blogImages")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrl } = supabaseClient.storage
          .from("blogImages")
          .getPublicUrl(fileName);

        imageUrl = publicUrl?.publicUrl || "";
      }

      const { error: insertError } = await supabaseClient.from("blogs").insert({
        title: values.title,
        content: values.content,
        subTitle: values.subTitle,
        imageUrl,
      });
      if (insertError) {
        throw insertError;
      }

      toast({
        title: "Post Created",
        description: "Post has been created successfully",
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormDescription>The title of the post</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sub Title</FormLabel>
              <FormControl>
                <Input placeholder="sub Title" {...field} />
              </FormControl>
              <FormDescription>The title of the post</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="content" {...field} />
              </FormControl>
              <FormDescription>The Content of the post</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input
                  className="items-center text-white"
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files)}
                />
              </FormControl>
              <FormDescription>The Image of the post</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  );
};

export default AddPostForm;
