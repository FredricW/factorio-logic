import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ params, locals, request }) => {
	try {
		const requestBody = await request.json();
		const requestData = requestBody.data;
		const newData = {
			name: requestData.name,
			collaborators: requestData.collaborators,
			description: requestData.description,
			is_public: requestData.is_public,
			data: requestData.data,
			history: requestData.history
		};

		locals.sb
			.from('blueprints')
			.update(newData)
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
