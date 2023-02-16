export interface GridItem {
	id: string;
	position: {
		x: number;
		y: number;
	};
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
