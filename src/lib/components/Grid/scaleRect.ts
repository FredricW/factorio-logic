import type { Rectangle } from './grid.types';

export const scaleRect = (rect: Rectangle, scale: number): Rectangle => ({
	x: rect.x * scale,
	y: rect.y * scale,
	width: rect.width * scale,
	height: rect.height * scale
});
