import { writable } from 'svelte/store';
import type { DragUpdateEvent, Position } from './grid.types';
import { domPositionToSVGPosition, getPositionFromEvent } from './positionUtils';

export const mousePosition = writable<{ global: Position; svg: Position; grid: Position } | null>(
	null
);

export const updateMousePosition =
	(svg: SVGSVGElement, gridSize?: number) => (event: DragUpdateEvent) => {
		const rawPosition = getPositionFromEvent(event);
		const domPosition = domPositionToSVGPosition(rawPosition, svg);
		// const rect = svg.getBoundingClientRect();

		mousePosition.set({
			global: rawPosition,
			svg: domPosition,
			grid: {
				x: gridSize ? Math.floor(domPosition.x / gridSize) : domPosition.x,
				y: gridSize ? Math.floor(domPosition.y / gridSize) : domPosition.y
			}
		});
	};
