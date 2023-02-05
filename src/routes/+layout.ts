import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect, type Load } from '@sveltejs/kit';
import type { PageData } from './$types';

export const load: Load = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);
	let profile = null;

	if (session?.user?.id) {
		profile = await supabaseClient.from('profiles').select('*').eq('id', session.user.id).single();

		if (event.url.pathname === '/login') {
			throw redirect(303, '/');
		}
	} else {
		if (event.url.pathname !== '/login') {
			throw redirect(303, '/login');
		}
	}

	return { session, profile: (profile?.data as PageData['profile']) ?? null };
};
