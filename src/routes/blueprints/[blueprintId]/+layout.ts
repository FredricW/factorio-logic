import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async (event) => {
	const { supabaseClient } = await getSupabase(event);

	if (!event.params.blueprintId) return { blueprint: null };

	const bpEntity = await supabaseClient
		.from('blueprints')
		.select('*')
		.eq('id', event.params.blueprintId)
		.single();

	return {
		blueprint: bpEntity.data
	};
};
