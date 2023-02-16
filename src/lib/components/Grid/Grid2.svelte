<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { spring } from 'svelte/motion';
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { getOuterRect } from './getOuterRect';
	import type { Rectangle, GridItem } from './grid.types';
	import GridCell from './GridCell.svelte';
	import { scaleRect } from './scaleRect';

	let viewBox = spring<Rectangle>({ x: 0, y: 0, width: 0, height: 0 });
	let itemPosition = writable({ x: 0, y: 0 });
	let activeItem = writable<string | null>(null);
	$: console.log('items', items);
	$: console.log('activeItem', $activeItem);
	$: console.log('itemPosition', $itemPosition);

	// drag and drop
	const startDragging = (item: GridItem) => {
		activeItem.set(item.id);
		itemPosition.set(item.position);
	};

	const stopDragging = () => {
		activeItem.set(null);
	};

	// function getMousePosition(event) {
	// 	var CTM = svg.getScreenCTM();
	// 	return {
	// 		x: (evt.clientX - CTM.e) / CTM.a,
	// 		y: (evt.clientY - CTM.f) / CTM.d
	// 	};
	// }

	const gridScale = 64; // px

	export let items: GridItem[] = [];

	const dispatch = createEventDispatcher();
	const onClick = (position: { x: number; y: number }) => (e: MouseEvent) => {
		e.preventDefault();
		dispatch('click', position);
	};

	$: outerRect = getOuterRect(items, 2);
	$: scaledRect = scaleRect(outerRect, gridScale);
	$: viewBox.set(scaledRect);

	let hoverPosition = writable({ x: 0, y: 0 });

	$: xAxis = new Array(outerRect.width).fill(0).map((_, i) => i + outerRect.x);
	$: yAxis = new Array(outerRect.height).fill(0).map((_, i) => i + outerRect.y);
</script>

<svelte:window
	on:mousemove={(e) => {
		if ($activeItem) {
			// const { x, y } = getGridPosition(e.clientX, e.clientY);
			itemPosition.update((p) => ({ x: p.x + e.movementX, y: p.y + e.movementY }));
		}
	}}
	on:mouseup={stopDragging}
/>

<p class="absolute top-4">Position: x|{$itemPosition.x} y|{$itemPosition.y}</p>
<p class="absolute top-12">Elem: x|{$hoverPosition.x} y|{$hoverPosition.y}</p>
<svg
	class="w-full h-full overflow-visible px-4"
	viewBox={[$viewBox.x, $viewBox.y, $viewBox.width, $viewBox.height].join(' ')}
>
	{#each xAxis as x}
		{#each yAxis as y}
			<GridCell
				rectangle={scaleRect({ x, y, width: 1, height: 1 }, gridScale)}
				on:click={onClick({ x, y })}
				on:mouseenter={() => {
					hoverPosition.set({ x, y });
				}}
			/>
		{/each}
	{/each}
	{#each items as item}
		<svg
			x={item.position.x * gridScale}
			y={item.position.y * gridScale}
			width={item.size.width * gridScale}
			height={item.size.height * gridScale}
			in:fade={{ duration: 100 }}
			class="overflow-visible absolute"
			id={item.id}
			on:mousedown={() => {
				console.log('mousedown');
				startDragging(item);
			}}
			on:mouseenter={() => {
				hoverPosition.set(item.position);
			}}
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
