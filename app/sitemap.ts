import supabaseClient from "@/database/supabase/supabase";
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

  // 3. Generate your localized homepage routes
  locales.forEach((locale) => {
    routes.push({
      url: `${process.env.LIVE_URL}/${locale}`, 
      lastModified: new Date(),
    });
  });

  // 4. Generate your Smart Alerts routes for each locale
  instrumentsSafe.forEach(({ instrument_name }) => {
    locales.forEach((locale) => {
      routes.push({
        url: `${process.env.LIVE_URL}/${locale}/smart-alerts/${instrument_name}`,
        lastModified: new Date(),
      });
    });
  });

  // 5. Generate your blog routes for each locale
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
