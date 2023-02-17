<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import {
		activeItem,
		itemPosition,
		startDragging,
		stopDragging,
		updateDragging
	} from './dragAndDrop';
	import { getOuterRect } from './getOuterRect';
	import type { Rectangle, GridItem } from './grid.types';
	import { scaleRect } from './scaleRect';
	import { mouseEventToSVGPosition } from './mouseEventToSVGPosition';

	let viewBox = tweened<Rectangle>(
		{ x: 0, y: 0, width: 0, height: 0 },
		{
			duration: 300,
			easing: cubicInOut
		}
	);
	let svg: SVGSVGElement;

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
</script>

<svelte:window
	on:mousemove={(e) => {
		updateDragging(mouseEventToSVGPosition(e, svg));
	}}
	on:mouseup={() => {
		if (!$activeItem) return;

		items = items.map((item) => {
			if (item.id === $activeItem) {
				return {
					...item,
					position: {
						x: Math.floor($itemPosition.x / gridScale),
						y: Math.floor($itemPosition.y / gridScale)
					}
				};
			}
			return item;
		});
		stopDragging();
	}}
/>

<p class="absolute top-4">Position: x|{$itemPosition.x} y|{$itemPosition.y}</p>
<p class="absolute top-12">Elem: x|{$hoverPosition.x} y|{$hoverPosition.y}</p>
<svg
	bind:this={svg}
	class="w-full h-full overflow-visible px-4 cursor-pointer"
	viewBox={[$viewBox.x, $viewBox.y, $viewBox.width, $viewBox.height].join(' ')}
>
	<defs>
		<pattern id="grid" width={gridScale} height={gridScale} patternUnits="userSpaceOnUse">
			<rect
				width={gridScale}
				height={gridScale}
				fill="none"
				class="stroke-base-100"
				stroke-width="1"
			/>
		</pattern>
	</defs>

	{#key $hoverPosition.x + $hoverPosition.y}
		<rect
			out:fade={{ duration: 50 }}
			x={$hoverPosition.x * gridScale}
			y={$hoverPosition.y * gridScale}
			width={gridScale}
			height={gridScale}
			class="fill-base-300 stroke-base-300"
		/>
	{/key}

	<rect
		x={$viewBox.x}
		y={$viewBox.y}
		width={$viewBox.width}
		height={$viewBox.height}
		fill="url(#grid)"
		class="outline-none stroke-accent/50 stroke-1"
		rx={4}
		ry={4}
		on:mousemove={(e) => {
			const position = mouseEventToSVGPosition(e, svg);
			hoverPosition.set({
				x: Math.floor(position.x / gridScale),
				y: Math.floor(position.y / gridScale)
			});
		}}
		on:focus
		on:click={(e) => {
			const position = mouseEventToSVGPosition(e, svg);
			onClick({
				x: Math.floor(position.x / gridScale),
				y: Math.floor(position.y / gridScale)
			})(e);
		}}
		on:keydown={(e) => {
			console.log(e);
		}}
	/>
	{#each items as item}
		{@const x = $activeItem === item.id ? $itemPosition.x : item.position.x * gridScale}
		{@const y = $activeItem === item.id ? $itemPosition.y : item.position.y * gridScale}
		<svg
			{x}
			{y}
			width={item.size.width * gridScale}
			height={item.size.height * gridScale}
			in:fade={{ duration: 100 }}
			class="overflow-visible absolute"
			id={item.id}
			on:mousedown={(e) => {
				const position = mouseEventToSVGPosition(e, svg);
				startDragging(item, position);
			}}
			on:mouseenter={() => {
				hoverPosition.set(item.position);
			}}
		>
			<foreignObject x="0" y="0" width="100%" height="100%" class="overflow-visible">
				<slot {item} />
			</foreignObject>
		</svg>
	{/each}
</svg>
