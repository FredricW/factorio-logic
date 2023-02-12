<script lang="ts">
	import { createEventDispatcher } from 'svelte';

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
		return { x, y, width, height };
	};

	$: outerRect = getOuterRect(items);

	$: console.log(outerRect);

	const getItemByGridPosition = (x: number, y: number) => {
		const res = items.find((item) => {
			return item.position.x === x && item.position.y === y;
		});

		return res;
	};
	const borderWidth = 1;
</script>

<svg
	class="w-full h-full overflow-visible px-4"
	viewBox={[outerRect.x, outerRect.y, outerRect.width, outerRect.height].join(' ')}
>
	{#each { length: outerRect.width } as _, col}
		{#each { length: outerRect.height } as _, row}
			<rect
				x={col + outerRect.x}
				y={row + outerRect.y}
				width={1}
				height={1}
				on:click={onClick({ x: col + outerRect.x, y: row + outerRect.y })}
				on:keydown
				on:keyup
				on:keypress
				class="fill-base-200 hover:fill-base-100 cursor-pointer stroke-[0.01] stroke-base-100"
			/>
		{/each}
	{/each}
	{#each items as item}
		<svg
			x={item.position.x}
			y={item.position.y}
			width={item.size.width}
			height={item.size.height}
			class="overflow-visible"
		>
			<slot {item} />
		</svg>
	{/each}
</svg>
