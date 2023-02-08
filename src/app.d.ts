// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { Database } from '$lib/types/supabase';
import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit';
import type { Session } from '@supabase/supabase-js';

// and what to do when importing types
declare namespace App {
	// interface Error {}
	interface Locals {
		session: Session | null;
		sb: TypedSupabaseClient;
	}
	interface PageData {
		session: import('@supabase/supabase-js').Session | null;
		profile: Database['public']['Tables']['profiles']['Row'] | null;
	}
	// interface Platform {}
}
