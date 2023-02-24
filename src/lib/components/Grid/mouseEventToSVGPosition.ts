import type { Position } from './grid.types';

export const mouseEventToSVGPosition = (e: MouseEvent, svg: SVGSVGElement): Position => {
	const CTM = svg.getScreenCTM();
	if (CTM === null) {
		throw new Error('CTM is null');
	}
	return {
		x: (e.clientX - CTM.e) / CTM.a,
		y: (e.clientY - CTM.f) / CTM.d
	};
};

export const touchEventToSVGPosition = (e: TouchEvent, svg: SVGSVGElement): Position => {
	const CTM = svg.getScreenCTM();
	if (CTM === null) {
		throw new Error('CTM is null');
	}
	return {
		x: (e.touches[0]?.clientX - CTM.e) / CTM.a,
		y: (e.touches[0]?.clientY - CTM.f) / CTM.d
	};
};
