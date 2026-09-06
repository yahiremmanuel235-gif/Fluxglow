import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Advertencia: Supabase URL o Anon Key no están definidas en las variables de entorno.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseClient = supabase;
export default supabase;
