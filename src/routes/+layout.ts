import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';
import type { PageData, LayoutLoad } from './$types';

export const load: LayoutLoad = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);
	let profile = null;

	if (session?.user?.id) {
		profile = await supabaseClient.from('profiles').select('*').eq('id', session.user.id).single();

		if (event.url.pathname === '/login') {
			throw redirect(303, '/dashboard');
		}
	} else {
		if (event.url.pathname !== '/login') {
			throw redirect(303, '/login');
		}
	}

	return { session, profile: (profile?.data as PageData['profile']) ?? null };
};
