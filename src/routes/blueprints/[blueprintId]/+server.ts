import { blueprintModuleSchema } from '$lib/types/blueprint';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ params, locals, request }) => {
	try {
		const requestBody = await request.json();
		const requestData = requestBody.data;
		const newData = blueprintModuleSchema.partial().parse({
			name: requestData.name,
			collaborators: requestData.collaborators,
			description: requestData.description,
			is_public: requestData.is_public,
			data: requestData.data,
			history: [] // skip history for now
		});

		locals.sb
			.from('blueprints')
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.update(newData as any) // TODO: Remove this when we have solved deletion diff history
			.eq('id', params.blueprintId)
			.eq('owner', locals.session?.user?.id)
			.throwOnError()
			.then((res) => {
				if (res.error) {
					console.error(res.error);
					throw error(500, 'Something went wrong');
				}
			});
	} catch (e) {
		console.error(e);
		throw error(500, 'Something went wrong');
	}

	return new Response();
};
