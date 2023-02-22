import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);

	if (!session?.user?.id) return { blueprints: null };

	const blueprints = await supabaseClient
		.from('blueprints')
		.select('*')
		.eq('owner', session.user.id)
		.limit(20);

	return { blueprints: blueprints.data };
};
