import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://frncdlmdbhlghxnlyvpc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZybmNkbG1kYmhsZ2h4bmx5dnBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDQyMTMsImV4cCI6MjA2NjMyMDIxM30.n5brAVtL_RvVqcQ8DyjugrSz7Xa4E6aUGIFmFNJE1mQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
