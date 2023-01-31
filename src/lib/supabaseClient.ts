import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createClient } from '@supabase/auth-helpers-sveltekit';

console.log('PUBLIC_SUPABASE_URL', PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
