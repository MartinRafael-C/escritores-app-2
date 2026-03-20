import { createClient } from '@supabase/supabase-js';

// Reemplaza esto con tus credenciales de la web de Supabase (Project Settings > API)
const supabaseUrl = 'https://eubpwjlhxxpcpsusfwoo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1YnB3amxoeHhwY3BzdXNmd29vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NjAzOTYsImV4cCI6MjA4OTIzNjM5Nn0.yQ15J7blV9PNztxIWXnmlvUtPxgJrMiLbSKJLbb2ZvA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);