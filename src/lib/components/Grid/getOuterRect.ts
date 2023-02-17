import type { GridItem, Rectangle } from './grid.types';

export const getOuterRect = (items: GridItem[], padding = 3) => {
	const x = items.reduce((acc, item) => Math.min(acc, item.position.x), 0) - padding;
	const y = items.reduce((acc, item) => Math.min(acc, item.position.y), 0) - padding;
	const width =
		items.reduce((acc, item) => Math.max(acc, item.position.x + item.size.width), 0) - x + padding;
	const height =
		items.reduce((acc, item) => Math.max(acc, item.position.y + item.size.height), 0) - y + padding;

	const rect: Rectangle = { x, y, width, height };

	return rect;
};
