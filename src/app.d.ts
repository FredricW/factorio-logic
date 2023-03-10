// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { Database } from '$lib/types/supabase';
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
			session: Session | null;
		}
		// interface Platform {}
		interface Supabase {
			Database: Database;
			SchemaName: 'public';
		}
	}
}

export {};
