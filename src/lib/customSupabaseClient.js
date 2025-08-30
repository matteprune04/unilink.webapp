import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://parqknkssocuimblzrfx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhcnFrbmtzc29jdWltYmx6cmZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNzA3MjcsImV4cCI6MjA3MTk0NjcyN30.EdfhhBZuuIDBL_QNAKb-Ew2EfkPxVezhBu_pUuG_FWQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);