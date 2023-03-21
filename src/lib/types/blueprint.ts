import { BlueprintEntity } from '$lib/blueprintEntities';
import { z } from 'zod';
import { jsonSchema } from './json';

export const positionSchema = z.object({
	x: z.number(),
	y: z.number()
});

export type Position = z.infer<typeof positionSchema>;

export const dimensionsSchema = z.object({
	height: z.number(),
	width: z.number()
});

export type Dimensions = z.infer<typeof dimensionsSchema>;

export const tileSchema = z.object({
	position: positionSchema,
	type: z.string()
});

export type Tile = z.infer<typeof tileSchema>;

export const blueprintItemSchema = z.object({
	type: z.literal('blueprint-item'),
	entity: BlueprintEntity,
	id: z.string().uuid(),
	position: positionSchema
});

export type BlueprintItem = z.infer<typeof blueprintItemSchema>;

// export const blueprintDataSchema = z.object({
// 	items: z.array(blueprintItemSchema),
// 	tiles: z.array(tileSchema)
// });

// export type BlueprintData = z.infer<typeof blueprintDataSchema>;

export const historySnapshotSchema = z.object({
	id: z.string().uuid(),
	timestamp: z.string().datetime(),
	diff: jsonSchema,
	ancestor: z.string().uuid().nullable()
});

export type HistorySnapshot = z.infer<typeof historySnapshotSchema>;

export const blueprintModuleSchema = z.object({
	id: z.string().uuid(),
	type: z.literal('blueprint-module'),
	created_at: z.string().datetime(),
	name: z.string(),
	owner: z.string().uuid(),
	description: z.string().optional().nullable(),
	is_public: z.boolean(),
	collaborators: z.array(z.string().uuid()),
	data: z.string(),
	history: z.array(historySnapshotSchema)
});

export type BlueprintModule = z.infer<typeof blueprintModuleSchema>;
