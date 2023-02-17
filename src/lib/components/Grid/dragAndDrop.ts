import { writable } from 'svelte/store';
import type { GridItem, Position } from './grid.types';

export const itemPosition = writable({ x: 0, y: 0 });
export const activeItem = writable<string | null>(null);

// drag and drop
export const startDragging = (item: GridItem, position: Position) => {
	activeItem.set(item.id);
	itemPosition.set(position);
};

export const updateDragging = (position: Position) => {
	if (activeItem) {
		itemPosition.set(position);
	}
};

export const stopDragging = () => {
	activeItem.set(null);
};
