import type { BlueprintEntityType } from '$lib/blueprintEntities';

type UUID = string;
type UserID = UUID;
type DeepPartial<T> = T extends object
	? {
			[P in keyof T]?: DeepPartial<T[P]>;
	  }
	: T;

export interface BlueprintModule {
	id: UUID;
	type: 'blueprint-module';
	created_at: string; // datestring
	name: string;
	owner: UserID; // uuid
	description?: string;
	is_public: boolean;
	collaborators: UserID[]; // uuid[]
	data: BlueprintData;
	history: HistorySnapshot<BlueprintData>[];
}

export interface HistorySnapshot<T> {
	id: UUID;
	timestamp: string; // datestring
	diff: DeepPartial<T>;
	ancestor: UUID;
}

export interface BlueprintData {
	items: BlueprintItem[];
	tiles: Tile[];
}

interface Tile {
	position: Position;
	type: string; // TODO: make a union for this
}

export interface Position {
	x: number;
	y: number;
}

export interface Dimensions {
	height: number;
	width: number;
}

export interface BlueprintItem {
	type: 'blueprint-item';
	entity: BlueprintEntityType;
	id: UUID;
	position: Position;
}
