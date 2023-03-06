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
		startExternalDragging,
		stopDragging,
		updateDragging
	} from './dragAndDrop';
	import { getOuterRect } from './getOuterRect';
	import type { Rectangle, GridItem, Position } from './grid.types';
	import { scaleRect } from './scaleRect';
	import {
		domPositionToSVGPosition,
		getPositionFromEvent,
		positionToGridPosition
	} from './positionUtils';

	// ================================================================================
	// Props
	// ================================================================================

	type T = $$Generic;
	export let items: GridItem<T>[] = [];
	export let manualDragStart: boolean = false;

	// ================================================================================
	// Config
	// ================================================================================

	const gridScale = 128; // px

	// ================================================================================
	// Stores
	// ================================================================================

	let isManualViewBox = false;
	let viewBox = tweened<Rectangle>(
		{ x: 0, y: 0, width: 0, height: 0 },
		{
			duration: 300,
			easing: cubicInOut
		}
	);
	let hoverPosition = writable<Position | null>(null);
	let svg: SVGSVGElement;

	// ================================================================================
	// Sync
	// ================================================================================

	$: gridItems = items;
	$: outerRect = getOuterRect(items, 2);
	$: scaledRect = scaleRect(outerRect, gridScale);
	$: if (!isManualViewBox) {
		viewBox.set(scaledRect);
	}

	$: {
		// if there is an active item, bring it to the front
		if ($activeItem) {
			const active = items.find((item) => item.id === $activeItem?.id);
			if (active) {
				const newGridItems = items.filter((item) => item.id !== active.id);
				newGridItems.push(active);
				gridItems = newGridItems;
			}
		}
	}

	// ================================================================================
	// Events
	// ================================================================================

	const dispatch = createEventDispatcher();

	const onClick = (position: { x: number; y: number }) => (e: MouseEvent) => {
		e.preventDefault();
		dispatch('click', position);
	};

	function dispatchOnDragEnd(updatedItem: GridItem<T>) {
		dispatch('dragend', updatedItem);
	}

	// ================================================================================
	// Helpers
	// ================================================================================

	const toGridPosition = positionToGridPosition(gridScale);
</script>

<svelte:window
	on:wheel={(e) => {
		if (!isManualViewBox) {
			isManualViewBox = true;
		}
		viewBox.update((prev) => ({ ...prev, x: prev.x + e.deltaX, y: prev.y + e.deltaY }), {
			delay: 0,
			duration: 0
		});
	}}
	on:mousemove={updateDragging(svg)}
	on:mouseup={() => {
		hoverPosition.set(null);
		const result = stopDragging();

		if (!result) return;

		// update the position of the item
		items = items.map((item) => {
			if (item.id === result.item.id) {
				const gridOffset = {
					x: Math.floor(result.item.offset.x / gridScale),
					y: Math.floor(result.item.offset.y / gridScale)
				};
				const newPosition = {
					x: Math.floor(result.position.x / gridScale) - gridOffset.x,
					y: Math.floor(result.position.y / gridScale) - gridOffset.y
				};

				const newItem = {
					...item,
					position: newPosition
				};

				dispatchOnDragEnd(newItem);

				return newItem;
			}
			return item;
		});
		stopDragging();
	}}
	on:touchmove={updateDragging(svg)}
	on:touchend={() => {
		hoverPosition.set(null);
		if (!$activeItem) return;

		const currentPosition = {
			x: $itemPosition.x + $activeItem.offset.x,
			y: $itemPosition.y + $activeItem.offset.y
		};

		items = items.map((item) => {
			if (item.id === $activeItem?.id) {
				const gridOffset = {
					x: Math.floor($activeItem.offset.x / gridScale),
					y: Math.floor($activeItem.offset.y / gridScale)
				};
				const newPosition = {
					x: Math.floor(currentPosition.x / gridScale) - gridOffset.x,
					y: Math.floor(currentPosition.y / gridScale) - gridOffset.y
				};

				const newItem = {
					...item,
					position: newPosition
				};

				dispatchOnDragEnd(newItem);

				return newItem;
			}
			return item;
		});
		stopDragging();
	}}
/>

<span class="badge fixed bottom-4 left-4 min-w-[4rem] opacity-70 hover:opacity-100"
	><span class="min-w-[1.5rem] text-center">{$hoverPosition?.x ?? '-'}</span>,<span
		class="min-w-[1.5rem] text-center">{$hoverPosition?.y ?? '-'}</span
	></span
>
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

	{#if $hoverPosition}
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
	{/if}

	<rect
		x={$viewBox.x}
		y={$viewBox.y}
		width={$viewBox.width}
		height={$viewBox.height}
		fill="url(#grid)"
		class="outline-none overscroll-none"
		rx={4}
		ry={4}
		on:focus
		on:click={(e) => {
			const eventPosition = getPositionFromEvent(e);
			const gridPosition = toGridPosition(domPositionToSVGPosition(eventPosition, svg));
			onClick(gridPosition)(e);
		}}
		on:keydown={(e) => {
			console.log(e);
		}}
	/>
	{#each gridItems as item (item.id)}
		{@const x = $activeItem?.id === item.id ? $itemPosition.x : item.position.x * gridScale}
		{@const y = $activeItem?.id === item.id ? $itemPosition.y : item.position.y * gridScale}
		<svg
			{x}
			{y}
			width={item.size.width * gridScale}
			height={item.size.height * gridScale}
			in:fade={{ duration: 100 }}
			class="overflow-visible absolute touch-none"
			id={item.id}
			on:mousedown={(e) => {
				if (manualDragStart) return;

				startDragging(svg, item)(e);
			}}
			on:touchstart={(e) => {
				if (manualDragStart) return;

				startDragging(svg, item)(e);
			}}
			on:mouseenter={() => {
				hoverPosition.set(item.position);
			}}
		>
			<slot
				{item}
				dragStart={startExternalDragging(svg, item, {
					x: item.position.x * gridScale,
					y: item.position.y * gridScale
				})}
			/>
		</svg>
	{/each}
</svg>

<style>
	:global(html) {
		overscroll-behavior: none;
		overflow: auto;
	}
</style>
