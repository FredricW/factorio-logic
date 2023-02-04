import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { Load } from '@sveltejs/kit';
import type { PageData } from './$types';

export const load: Load = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);
	const profile = await supabaseClient
		.from('profiles')
		.select('*')
		.eq('id', session?.user?.id)
		.single();

	return { session, profile: (profile.data as PageData['profile']) ?? null };
};
