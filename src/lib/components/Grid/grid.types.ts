export interface Position {
	x: number;
	y: number;
}
export interface GridItem {
	id: string;
	position: Position;
	size: {
		width: number;
		height: number;
	};
	data: any;
}

export interface Rectangle {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface DraggableItem {
	id: string;
	offset: Position;
	data?: any;
}
