import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import FactorioBlueprint from 'factorio-blueprint';
import type { Actions } from './$types';

export const actions: Actions = {
	create: async (event) => {
		const formData = await event.request.formData();

		const { session, supabaseClient } = await getSupabase(event);

		if (session?.user?.id) {
			const bp = new FactorioBlueprint().toJSON();

			supabaseClient
				.from('blueprints')
				.insert([
					{
						author: session.user.id,
						name: formData.get('name') as unknown as string,
						data: bp
					}
				])
				.then((res) => {
					console.log(res);
				});
		}
	}
};
