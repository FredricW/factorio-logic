import { z } from 'zod';

export const BlueprintEntity = z.enum([
	'constant_combinator',
	'arithmetic_combinator',
	'decider_combinator',
	// 'power_switch',
	'programmable_speaker',
	// 'storage_tank',
	// 'pipe',
	// 'pipe_to_ground',
	// 'offshore_pump',
	// 'pump',
	// 'boiler',
	// 'steam_engine',
	// 'solar_panel',
	// 'accumulator',
	// 'nuclear_reactor',
	// 'heat_exchanger',
	// 'heat_pipe',
	// 'burner_mining_drill',
	// 'electric_mining_drill',
	// 'pumpjack',
	// 'stone_furnace',
	// 'steel_furnace',
	// 'electric_furnace',
	// 'assembling_machine_1',
	// 'assembling_machine_2',
	// 'assembling_machine_3',
	// 'oil_refinery',
	// 'chemical_plant',
	// 'centrifuge',
	// 'lab',
	// 'beacon',
	// 'speed_module',
	// 'speed_module_2',
	// 'speed_module_3',
	// 'effectivity_module',
	// 'effectivity_module_2',
	// 'effectivity_module_3',
	// 'productivity_module',
	// 'productivity_module_2',
	// 'productivity_module_3',
	// 'stack_inserter',
	// 'filter_inserter',
	// 'furnace',
	'electric_pole'
	// 'underground_belt',
	// 'splitter',
	// 'transport_belt',
	// 'loader',
]);

export type BlueprintEntity = z.infer<typeof BlueprintEntity>;

interface BlueprintEntityTemplate {
	name: string;
	id: BlueprintEntity;
	dimensions: {
		height: number;
		width: number;
	};
}

export const blueprintEntities = {
	constant_combinator: {
		name: 'Constant Combinator',
		id: BlueprintEntity.Enum.constant_combinator,
		dimensions: {
			height: 1,
			width: 1
		}
	},
	arithmetic_combinator: {
		name: 'Arithmetic Combinator',
		id: BlueprintEntity.Enum.arithmetic_combinator,
		dimensions: {
			height: 2,
			width: 1
		}
	},
	decider_combinator: {
		name: 'Decider Combinator',
		id: BlueprintEntity.Enum.decider_combinator,
		dimensions: {
			height: 2,
			width: 1
		}
	},
	programmable_speaker: {
		name: 'Programmable Speaker',
		id: BlueprintEntity.Enum.programmable_speaker,
		dimensions: {
			height: 1,
			width: 1
		}
	},
	electric_pole: {
		name: 'Electric Pole',
		id: BlueprintEntity.Enum.electric_pole,
		dimensions: {
			height: 1,
			width: 1
		}
	}
} as const satisfies Record<BlueprintEntity, BlueprintEntityTemplate>;

export type BlueprintEntityType = keyof typeof blueprintEntities;
