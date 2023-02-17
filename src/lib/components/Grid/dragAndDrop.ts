import { writable } from 'svelte/store';
import type { DraggableItem, Position } from './grid.types';

export const itemPosition = writable({ x: 0, y: 0 });
export const activeItem = writable<DraggableItem | null>(null);

// drag and drop
export const startDragging = (item: DraggableItem, position: Position) => {
	activeItem.set(item);
	itemPosition.set({
		x: position.x - item.offset.x,
		y: position.y - item.offset.y
	});
};

export const updateDragging = (position: Position, activeItem: DraggableItem) => {
	if (activeItem) {
		itemPosition.set({
			x: position.x - activeItem.offset.x,
			y: position.y - activeItem.offset.y
		});
	}
};

export const stopDragging = () => {
	activeItem.set(null);
};
