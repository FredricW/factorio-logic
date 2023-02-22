interface BlueprintEntityTemplate {
	name: string;
	id: string;
	dimensions: {
		height: number;
		width: number;
	};
}

export const blueprintEntities = {
	constant_combinator: {
		name: 'Constant Combinator',
		id: 'constant_combinator',
		dimensions: {
			height: 1,
			width: 1
		}
	}
} as const satisfies Record<string, BlueprintEntityTemplate>;

export type BlueprintEntityType = keyof typeof blueprintEntities;
