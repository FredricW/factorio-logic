import type { BlueprintModule } from './types/blueprint';

export const createBlueprintModule = (userId: string, name: string): BlueprintModule => {
	const newBp: BlueprintModule = {
		id: crypto.randomUUID(),
		owner: userId,
		collaborators: [],
		created_at: new Date().toISOString(),
		name,
		type: 'blueprint-module',
		data: '',
		history: [],
		is_public: false
	};
	return newBp;
};
