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
	import type { Rectangle, GridItem, Position } from './grid.types';
	import { scaleRect } from './scaleRect';
	import { mouseEventToSVGPosition, touchEventToSVGPosition } from './mouseEventToSVGPosition';

	let viewBox = tweened<Rectangle>(
		{ x: 0, y: 0, width: 0, height: 0 },
		{
			duration: 300,
			easing: cubicInOut
		}
	);
	let svg: SVGSVGElement;

	const gridScale = 128; // px

	type T = $$Generic;

	export let items: GridItem<T>[] = [];
	// this will be reorded by the grid to bring the active item to the front
	$: gridItems = items;
	$: {
		if ($activeItem) {
			const active = items.find((item) => item.id === $activeItem?.id);
			if (active) {
				const newGridItems = items.filter((item) => item.id !== active.id);
				newGridItems.push(active);
				gridItems = newGridItems;
			}
		}
	}

	const dispatch = createEventDispatcher();
	const onClick = (position: { x: number; y: number }) => (e: MouseEvent) => {
		e.preventDefault();
		dispatch('click', position);
	};

	$: outerRect = getOuterRect(items, 2);
	$: scaledRect = scaleRect(outerRect, gridScale);
	$: viewBox.set(scaledRect);

	function dispatchOnDragEnd(updatedItem: GridItem<T>) {
		dispatch('dragend', updatedItem);
	}

	let hoverPosition = writable<Position | null>(null);

	const isWithinBounds = (position: Position) => {
		const isInsideX = position.x >= outerRect.x && position.x < outerRect.x + outerRect.width;
		const isInsideY = position.y >= outerRect.y && position.y < outerRect.y + outerRect.height;
		return isInsideX && isInsideY;
	};
</script>

<svelte:window
	on:mousemove={(e) => {
		const position = mouseEventToSVGPosition(e, svg);
		if ($activeItem) {
			updateDragging(position, $activeItem);
		}

		const scaledPosition = {
			x: Math.floor(position.x / gridScale),
			y: Math.floor(position.y / gridScale)
		};

		if (isWithinBounds(scaledPosition)) {
			hoverPosition.set(scaledPosition);
		} else {
			hoverPosition.set(null);
		}
	}}
	on:mouseup={(e) => {
		if (!$activeItem) return;

		const currentPosition = mouseEventToSVGPosition(e, svg);

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
	on:touchmove={(e) => {
		const position = touchEventToSVGPosition(e, svg);
		if ($activeItem) {
			updateDragging(position, $activeItem);
		}

		const scaledPosition = {
			x: Math.floor(position.x / gridScale),
			y: Math.floor(position.y / gridScale)
		};

		if (isWithinBounds(scaledPosition)) {
			hoverPosition.set(scaledPosition);
		} else {
			hoverPosition.set(null);
		}
	}}
	on:touchend={() => {
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

<span class="badge fixed bottom-4 left-4"
	>{$hoverPosition?.x ?? '-'} / {$hoverPosition?.y ?? '-'}</span
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
		class="outline-none stroke-accent/50 stroke-1"
		rx={4}
		ry={4}
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
				const position = mouseEventToSVGPosition(e, svg);
				const offset = {
					x: position.x - parseFloat(e.currentTarget?.getAttributeNS(null, 'x') ?? '0'),
					y: position.y - parseFloat(e.currentTarget?.getAttributeNS(null, 'y') ?? '0')
				};
				startDragging(
					{
						id: item.id,
						offset,
						data: item.data
					},
					position
				);
			}}
			on:touchstart={(e) => {
				const position = touchEventToSVGPosition(e, svg);
				const offset = {
					x: position.x - parseFloat(e.currentTarget?.getAttributeNS(null, 'x') ?? '0'),
					y: position.y - parseFloat(e.currentTarget?.getAttributeNS(null, 'y') ?? '0')
				};
				startDragging(
					{
						id: item.id,
						offset,
						data: item.data
					},
					position
				);
			}}
			on:mouseenter={() => {
				hoverPosition.set(item.position);
			}}
		>
			<slot {item} />
		</svg>
	{/each}
</svg>
