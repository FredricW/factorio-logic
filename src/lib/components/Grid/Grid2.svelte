<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { itemPosition, startDragging, stopDragging, updateDragging } from './dragAndDrop';
	import { getOuterRect } from './getOuterRect';
	import type { Rectangle, GridItem } from './grid.types';
	import { scaleRect } from './scaleRect';

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

<svelte:window on:mousemove={updateDragging} on:mouseup={stopDragging} />

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

	<rect
		x={$hoverPosition.x * gridScale}
		y={$hoverPosition.y * gridScale}
		width={gridScale}
		height={gridScale}
		class="fill-base-300 stroke-base-300"
	/>

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
			const CTM = svg.getScreenCTM();

			if (!CTM) return;

			const position = {
				x: (e.clientX - CTM.e) / CTM.a,
				y: (e.clientY - CTM.f) / CTM.d
			};
			hoverPosition.set({
				x: Math.floor(position.x / gridScale),
				y: Math.floor(position.y / gridScale)
			});
		}}
		on:focus
		on:click={(e) => {
			const CTM = svg.getScreenCTM();

			if (!CTM) return;

			const position = {
				x: (e.clientX - CTM.e) / CTM.a,
				y: (e.clientY - CTM.f) / CTM.d
			};
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
		<svg
			x={item.position.x * gridScale}
			y={item.position.y * gridScale}
			width={item.size.width * gridScale}
			height={item.size.height * gridScale}
			in:fade={{ duration: 100 }}
			class="overflow-visible absolute"
			id={item.id}
			on:mousedown={() => {
				startDragging(item);
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
