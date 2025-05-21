import supabaseClient from "@/database/supabase/client";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Define the locales you want to include
  // Make sure these match the locales configured in your Next.js app
  const locales = ["en", "fr", "ru", "sp"]; // etc.

  const { data: instruments } = await supabaseClient
    .from("instruments_info")
    .select("instrument_name");

  const { data: blogs } = await supabaseClient.from("blogs").select("id");

  // Just in case instruments or blogs returns null
  const instrumentsSafe = instruments || [];
  const blogsSafe = blogs || [];

  // 2. Create an array for all the URLs
  const routes: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    routes.push({
      url: `${process.env.LIVE_URL}/${locale}`, 
      lastModified: new Date(),
    });
  });

  locales.forEach((locale) => {
    routes.push({
      url: `${process.env.LIVE_URL}/${locale}/smart-alerts`, 
      lastModified: new Date(),
    });
  });



  instrumentsSafe.forEach(({ instrument_name }) => {
    locales.forEach((locale) => {
      routes.push({
        url: `${process.env.LIVE_URL}/${locale}/smart-alerts/${instrument_name}`,
        lastModified: new Date(),
      });
    });
  });

  blogsSafe.forEach(({ id }) => {
    locales.forEach((locale) => {
      routes.push({
        url: `${process.env.LIVE_URL}/${locale}/blog/${id}`,
        lastModified: new Date(),
      });
    });
  });

  return routes;
}
