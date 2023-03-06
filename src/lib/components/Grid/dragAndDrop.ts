import { writable, get } from 'svelte/store';
import type { DraggableItem, DragStartEvent, GridItem, Position } from './grid.types';
import {
	domPositionToSVGPosition,
	getOffsetPositionFromEvent,
	getPositionFromEvent
} from './positionUtils';

export const activeItem = writable<DraggableItem | null>(null);

export const startDragging = (svg: SVGSVGElement, item: GridItem) => (event: DragStartEvent) => {
	const rawPosition = getPositionFromEvent(event);
	const domPosition = domPositionToSVGPosition(rawPosition, svg);
	const offset = getOffsetPositionFromEvent(event, domPosition);

	activeItem.set({
		id: item.id,
		offset,
		data: item.data
	});
};

export const startExternalDragging =
	(svg: SVGSVGElement, item: GridItem, svgPosition: Position) => (event: DragStartEvent) => {
		const mousePosition = getPositionFromEvent(event);
		const domPosition = domPositionToSVGPosition(mousePosition, svg);
		const offset = {
			x: domPosition.x - svgPosition.x,
			y: domPosition.y - svgPosition.y
		};

		activeItem.set({
			id: item.id,
			offset,
			data: item.data
		});
	};

export const stopDragging = () => {
	const item = get(activeItem);
	if (!item) return;

	activeItem.set(null);

	return item;
};
