import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	loginGithub: async (event) => {
		const { error } = await event.locals.sb.auth.signInWithOAuth({ provider: 'github' });

		if (error) throw error;

		throw redirect(303, '/dashboard');
	}
};
