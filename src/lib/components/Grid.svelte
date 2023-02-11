<script lang="ts">
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

	const getOuterRect = (items: GridItem[]) => {
		const padding = 4;
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

	const outerRect = getOuterRect(items);

	const getItemByGridPosition = (x: number, y: number) => {
		const res = items.find((item) => {
			return item.position.x === x && item.position.y === y;
		});

		return res;
	};
</script>

<div class="flex w-full h-full">
	{#each { length: outerRect.width } as _, col}
		<div class="flex-1 flex flex-col">
			{#each { length: outerRect.height } as _, row}
				{@const item = getItemByGridPosition(col + outerRect.x, row + outerRect.y)}
				<div class="bg-base-300 w-full relative border border-gray-500/10 flex-1 hover:bg-base-100">
					{#if item}
						<div
							class="absolute z-10"
							style={`width: ${100 * item.size.width}%; height: ${100 * item.size.height}%`}
						>
							<slot {item} />
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/each}
</div>
