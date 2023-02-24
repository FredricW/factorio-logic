import type { DragStartEvent, Position } from './grid.types';

export const svgPositionToDOMPosition = (position: Position, svg: SVGSVGElement): Position => {
	const CTM = svg.getScreenCTM();
	if (CTM === null) {
		throw new Error('CTM is null');
	}
	return {
		x: position.x * CTM.a + CTM.e,
		y: position.y * CTM.d + CTM.f
	};
};

export const domPositionToSVGPosition = (position: Position, svg: SVGSVGElement): Position => {
	const CTM = svg.getScreenCTM();
	if (CTM === null) {
		throw new Error('CTM is null');
	}
	return {
		x: (position.x - CTM.e) / CTM.a,
		y: (position.y - CTM.f) / CTM.d
	};
};

export const getPositionFromEvent = (event: MouseEvent | TouchEvent) => {
	if (event instanceof MouseEvent) {
		return {
			x: event.clientX,
			y: event.clientY
		};
	}
	return {
		x: event.touches[0]?.clientX,
		y: event.touches[0]?.clientY
	};
};

export const getOffsetFromEvent = (event: DragStartEvent, attribute: 'x' | 'y') =>
	parseFloat(event.currentTarget?.getAttributeNS(null, attribute) ?? '0');

export const getOffsetPositionFromEvent = (event: DragStartEvent, position: Position) => {
	return {
		x: position.x - getOffsetFromEvent(event, 'x'),
		y: position.y - getOffsetFromEvent(event, 'y')
	};
};

export const positionToGridPosition = (gridSize: number) => (position: Position) => ({
	x: Math.floor(position.x / gridSize),
	y: Math.floor(position.y / gridSize)
});

export interface Boundary {
	x: number;
	y: number;
	width: number;
	height: number;
}

export const isPositionWithinBoundary = (position: Position, boundary: Boundary) => {
	return (
		position.x >= boundary.x &&
		position.x <= boundary.x + boundary.width &&
		position.y >= boundary.y &&
		position.y <= boundary.y + boundary.height
	);
};
