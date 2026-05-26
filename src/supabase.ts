import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hjrdkgjvxtghprcavdrb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqcmRrZ2p2eHRnaHByY2F2ZHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2MzgxNDksImV4cCI6MjA5MzIxNDE0OX0.gihBMuGpxBlqN8p91rwrhnIcPnqOesR7K3EIWoIpoQo";

// Correct way to initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey,
    },
  },
});