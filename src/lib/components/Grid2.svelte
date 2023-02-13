<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { spring } from 'svelte/motion';
	import { fade } from 'svelte/transition';

	let viewBox = spring({ x: 0, y: 0, width: 0, height: 0 });

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
	$: {
		viewBox.set(outerRect);
	}
	// $: viewBox = readable(outerRect);

	$: console.log(outerRect);

	const getItemByGridPosition = (x: number, y: number) => {
		const res = items.find((item) => {
			return item.position.x === x && item.position.y === y;
		});

		return res;
	};
	const crossModifier = 8;
	const crossSize = 0.5;
</script>

<svg
	class="w-full h-full overflow-visible px-4"
	viewBox={[$viewBox.x, $viewBox.y, $viewBox.width, $viewBox.height].join(' ')}
>
	{#each { length: outerRect.width / gridSize } as _, col}
		{#each { length: outerRect.height / gridSize } as _, row}
			{@const x = (col + outerRect.x / gridSize) * gridSize}
			{@const y = (row + outerRect.y / gridSize) * gridSize}
			{@const length = gridSize / crossModifier}
			<g>
				<rect
					{x}
					{y}
					width={gridSize}
					height={gridSize}
					on:click={onClick({
						x: col + outerRect.x / gridSize,
						y: row + outerRect.y / gridSize
					})}
					on:keydown
					on:keyup
					on:keypress
					class="fill-base-200 transition-all hover:shadow-2xl hover:fill-base-100 cursor-pointer stroke-[0.5] stroke-base-100"
				/>

				<line
					x1={x}
					y1={y}
					x2={x + length}
					y2={y}
					stroke-width={crossSize}
					class="stroke-base-content/10"
				/>
				<line
					x1={x}
					y1={y}
					x2={x}
					y2={y + length}
					stroke-width={crossSize}
					class="stroke-base-content/10"
				/>

				<line
					x1={x + gridSize}
					y1={y + gridSize}
					x2={x + gridSize - length}
					y2={y + gridSize}
					stroke-width={crossSize}
					class="stroke-base-content/10"
				/>
				<line
					x1={x + gridSize}
					y1={y + gridSize}
					x2={x + gridSize}
					y2={y + gridSize - length}
					stroke-width={crossSize}
					class="stroke-base-content/10"
				/>

				<line
					x1={x + gridSize}
					y1={y}
					x2={x + gridSize}
					y2={y + length}
					stroke-width={crossSize}
					class="stroke-base-content/10"
				/>
				<line
					x1={x + gridSize}
					y1={y}
					x2={x + gridSize - length}
					y2={y}
					stroke-width={crossSize}
					class="stroke-base-content/10"
				/>

				<line
					x1={x}
					y1={y + gridSize}
					x2={x + length}
					y2={y + gridSize}
					stroke-width={crossSize}
					class="stroke-base-content/10"
				/>
				<line
					x1={x}
					y1={y + gridSize}
					x2={x}
					y2={y + gridSize - length}
					stroke-width={crossSize}
					class="stroke-base-content/10"
				/>
			</g>
		{/each}
	{/each}
	{#each items as item}
		<svg
			x={item.position.x * gridSize}
			y={item.position.y * gridSize}
			width={item.size.width * gridSize}
			height={item.size.height * gridSize}
			in:fade={{ duration: 100 }}
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
