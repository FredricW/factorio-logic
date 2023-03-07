/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Position {
	x: number;
	y: number;
}

export interface Size {
	width: number;
	height: number;
}
export interface GridItem<T = unknown> {
	id: string;
	position: Position;
	size: Size;
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
	originalPosition: Position;
	size: Size;
	data?: T;
}

export type DragStartEvent =
	| (MouseEvent & {
			currentTarget: EventTarget & SVGElement;
	  })
	| (TouchEvent & {
			currentTarget: EventTarget & SVGElement;
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
