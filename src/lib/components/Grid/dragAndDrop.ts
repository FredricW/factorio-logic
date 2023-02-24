import { writable, get } from 'svelte/store';
import type {
	DraggableItem,
	DragStartEvent,
	DragUpdateEvent,
	GridItem,
	Position
} from './grid.types';
import {
	domPositionToSVGPosition,
	getOffsetPositionFromEvent,
	getPositionFromEvent
} from './positionUtils';

export const itemPosition = writable({ x: 0, y: 0 });
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

	itemPosition.set({
		x: domPosition.x - offset.x,
		y: domPosition.y - offset.y
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

		itemPosition.set({
			x: domPosition.x - offset.x,
			y: domPosition.y - offset.y
		});
	};

export const updateDragging = (svg: SVGSVGElement) => (event: DragUpdateEvent) => {
	const item = get(activeItem);
	if (!item) return;

	const rawPosition = getPositionFromEvent(event);
	const domPosition = domPositionToSVGPosition(rawPosition, svg);
	const offsetPosition = {
		x: domPosition.x - item.offset.x,
		y: domPosition.y - item.offset.y
	};

	itemPosition.set(offsetPosition);
};

export const stopDragging = () => {
	const item = get(activeItem);
	if (!item) return;

	const position = get(itemPosition);
	activeItem.set(null);

	return {
		item,
		position: {
			x: position.x + item.offset.x,
			y: position.y + item.offset.y
		}
	};
};
