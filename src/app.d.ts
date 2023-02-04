// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit';
import type { Session } from '@supabase/supabase-js';

// and what to do when importing types
declare global {
	declare namespace App {
		// interface Error {}
		interface Locals {
			session: Session | null;
			sb: TypedSupabaseClient;
		}
		interface PageData {
			session: import('@supabase/supabase-js').Session | null;
			profile: {
				id: string;
				username?: string;
				update_at?: string;
				full_name?: string;
				avatar_url?: string;
				website?: string;
			} | null;
		}
		// interface Platform {}
	}
}
