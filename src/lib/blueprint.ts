import FactorioBlueprint from 'factorio-blueprint';

export const createNewBlueprint = (): unknown => {
	const blueprint = new FactorioBlueprint();
	console.log('blueprint', blueprint);
	// blueprint.label = 'New Blueprint';
	// blueprint.icons = [];
	// blueprint.entities = [];
	// blueprint.tiles = [];
	// blueprint.item = 'blueprint';
	// blueprint.version = 281479271743488;
	return blueprint;
};
