<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { readable } from 'svelte/store';

	// Implements an svg grid system

	interface GridItem {
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
	const gridSize = 64; // px

	export let items: GridItem[] = [];

	const dispatch = createEventDispatcher();
	const onClick = (position: { x: number; y: number }) => (e: MouseEvent) => {
		e.preventDefault();
		dispatch('click', position);
	};

	$: getOuterRect = (items: GridItem[]) => {
		const padding = 3;
		const x = items.reduce((acc, item) => Math.min(acc, item.position.x), 0) - padding;
		const y = items.reduce((acc, item) => Math.min(acc, item.position.y), 0) - padding;
		const width =
			items.reduce((acc, item) => Math.max(acc, item.position.x + item.size.width), 0) -
			x +
			padding;
		const height =
			items.reduce((acc, item) => Math.max(acc, item.position.y + item.size.height), 0) -
			y +
			padding;
		return { x: x * gridSize, y: y * gridSize, width: width * gridSize, height: height * gridSize };
	};

	$: outerRect = getOuterRect(items);
	$: viewBox = readable(outerRect);

	$: console.log(outerRect);

	const getItemByGridPosition = (x: number, y: number) => {
		const res = items.find((item) => {
			return item.position.x === x && item.position.y === y;
		});

		return res;
	};
</script>

<svg
	class="w-full h-full overflow-visible px-4"
	viewBox={[$viewBox.x, $viewBox.y, $viewBox.width, $viewBox.height].join(' ')}
>
	{#each { length: outerRect.width / gridSize } as _, col}
		{#each { length: outerRect.height / gridSize } as _, row}
			<rect
				x={(col + outerRect.x / gridSize) * gridSize}
				y={(row + outerRect.y / gridSize) * gridSize}
				width={gridSize}
				height={gridSize}
				on:click={onClick({
					x: col + outerRect.x / gridSize,
					y: row + outerRect.y / gridSize
				})}
				on:keydown
				on:keyup
				on:keypress
				class="fill-base-200 transition-all hover:fill-base-100 cursor-pointer stroke-[0.5] stroke-base-100"
			/>
		{/each}
	{/each}
	{#each items as item}
		<svg
			x={item.position.x * gridSize}
			y={item.position.y * gridSize}
			width={item.size.width * gridSize}
			height={item.size.height * gridSize}
			class="overflow-visible"
		>
			<foreignObject x="0" y="0" width="100%" height="100%" class="overflow-visible">
				<slot {item} />
			</foreignObject>
			<!-- <text
				x="50%"
				y="50%"
				font-size="1rem"
				text-anchor="middle"
				dominant-baseline="middle"
				class="fill-primary-content">{item.id}</text
			> -->
		</svg>
	{/each}
</svg>
