/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Position {
	x: number;
	y: number;
}
export interface GridItem<T = unknown> {
	id: string;
	position: Position;
	size: {
		width: number;
		height: number;
	};
	data: T;
}

export interface Rectangle {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface DraggableItem<T = unknown> {
	id: string;
	offset: Position;
	data?: T;
}

export type DragStartEvent =
	| (MouseEvent & {
			currentTarget: EventTarget & SVGSVGElement;
	  })
	| (TouchEvent & {
			currentTarget: EventTarget & SVGSVGElement;
	  });

export type DragUpdateEvent =
	| (MouseEvent & {
			currentTarget: EventTarget & Window;
	  })
	| (TouchEvent & {
			currentTarget: EventTarget & Window;
	  });

export type DragEndEvent =
	| (MouseEvent & {
			currentTarget: EventTarget & Window;
	  })
	| (TouchEvent & {
			currentTarget: EventTarget & Window;
	  });
