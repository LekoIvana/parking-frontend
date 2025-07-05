import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://unbfufmeavxsqhtoeawg.supabase.co' 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuYmZ1Zm1lYXZ4c3FodG9lYXdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MTQwNzcsImV4cCI6MjA2NzI5MDA3N30.JbUgw_EiQD3sXhWszAsqQHjQKKo_dRMN6MvK11RWC3M'            // <-- kopiraj isto od tamo

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
