import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder-url.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "PLACEHOLDER_ANON_KEY";

// Create and export Supabase PostgreSQL client connection
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
