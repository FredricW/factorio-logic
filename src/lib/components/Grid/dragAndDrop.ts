import { writable } from 'svelte/store';
import type { GridItem } from './grid.types';

export const itemPosition = writable({ x: 0, y: 0 });
export const activeItem = writable<string | null>(null);

// drag and drop
export const startDragging = (item: GridItem) => {
	activeItem.set(item.id);
	itemPosition.set(item.position);
};

export const updateDragging = (position: { x: number; y: number }) => {
	if (activeItem) {
		// const { x, y } = getGridPosition(e.clientX, e.clientY);
		// itemPosition.update((p) => ({ x: p.x + e.movementX, y: p.y + e.movementY }));
	}
};

export const stopDragging = () => {
	activeItem.set(null);
};
