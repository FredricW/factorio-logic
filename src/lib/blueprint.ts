import type {
	BlueprintData,
	BlueprintItem,
	BlueprintModule,
	HistorySnapshot,
	Position
} from './types/blueprint';
import { diff } from 'deep-object-diff';
import type { BlueprintEntityType } from './blueprintEntities';
import { jsonSchema } from './types/json';

export const createBlueprintModule = (userId: string, name: string): BlueprintModule => {
	const newBp: BlueprintModule = {
		id: crypto.randomUUID(),
		owner: userId,
		collaborators: [],
		created_at: new Date().toISOString(),
		name,
		type: 'blueprint-module',
		data: {
			items: [],
			tiles: []
		},
		history: [],
		is_public: false
	};
	return newBp;
};

export const updateBlueprintData = (
	blueprintModule: BlueprintModule,
	newData: Partial<BlueprintData>
) => {
	const mergedData = { ...blueprintModule.data, ...newData };
	const dataDiff = jsonSchema.parse(diff(blueprintModule.data, mergedData));
	const timestamp = new Date().toISOString();
	const snapshot: HistorySnapshot = {
		id: crypto.randomUUID(),
		ancestor: blueprintModule.history[blueprintModule.history.length - 1]?.id ?? null,
		timestamp,
		diff: dataDiff
	};

	const newModule: BlueprintModule = {
		...blueprintModule,
		data: mergedData,
		history: [...blueprintModule.history, snapshot]
	};

	return newModule;
};

export const createBlueprintItem = (
	blueprintModule: BlueprintModule,
	type: BlueprintEntityType,
	position: Position
) => {
	const newItem: BlueprintItem = {
		type: 'blueprint-item',
		entity: type,
		id: crypto.randomUUID(),
		position
	};

	const newModule = updateBlueprintData(blueprintModule, {
		...blueprintModule.data,
		items: [...blueprintModule.data.items, newItem]
	});

	return newModule;
};
