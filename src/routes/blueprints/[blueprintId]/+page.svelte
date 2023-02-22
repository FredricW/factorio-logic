<script lang="ts">
	import { createBlueprintItem, updateBlueprintData } from '$lib/blueprint';
	import Grid from '$lib/components/Grid/Grid.svelte';
	import type { BlueprintItem, BlueprintModule, Position } from '$lib/types/blueprint';
	import FactorioBlueprint from 'factorio-blueprint';
	import type { PageData } from './$types';
	import type { GridItem } from '$lib/components/Grid/grid.types';

	export let data: PageData;

	let blueprintModule = data.blueprint;

	$: items = blueprintModule?.data.items ?? [];
	$: gridItems = items.map((item) => {
		return {
			id: item.id,
			position: item.position,
			size: {
				width: 1,
				height: 1
			},
			data: item
		} as GridItem<BlueprintItem>;
	});

	const moveItem = (event: CustomEvent<GridItem<BlueprintItem>>) => {
		if (!blueprintModule) return;

		blueprintModule = updateBlueprintData(blueprintModule, {
			items: items.map((item) => {
				if (item.id === event.detail.id) {
					return {
						...item,
						position: {
							x: event.detail.position.x,
							y: event.detail.position.y
						}
					};
				}

				return item;
			})
		});
	};

	const addComponent = (event: CustomEvent<{ x: number; y: number }>) => {
		if (!blueprintModule) return;

		blueprintModule = createBlueprintItem(blueprintModule, 'constant_combinator', {
			x: event.detail.x,
			y: event.detail.y
		});
	};
</script>

<div class="max-w-screen-2xl m-auto">
	<div class="flex justify-between md:px-4">
		<div>
			<div class="text-sm breadcrumbs">
				<ul>
					<li><a href="/dashboard">Dashboard</a></li>
					<li>Blueprint</li>
				</ul>
			</div>
			<div class="prose">
				<h1>{data.blueprint?.name}</h1>
			</div>
		</div>
		<div class="py-4">
			<button class="btn">Invite</button>
			<button class="btn btn-primary">Publish</button>
		</div>
	</div>
	<div class="flex absolute h-screen top-0 z-20 pointer-events-none">
		<div class="flex items-center">
			<div class="bg-base-100 hidden rounded-r min-w-[260px] pointer-events-auto">
				<div class="p-4">
					<h3 class="text-xl font-bold">Components</h3>
				</div>
			</div>
		</div>
	</div>
	<div class="flex items-center justify-center h-[90vh]">
		<Grid items={gridItems} on:dragend={moveItem} let:item on:click={addComponent}>
			<div class="p-1 w-full h-full">
				<div class="tooltip w-full h-full" data-tip={item.data.entity}>
					<div class="bg-primary rounded shadow-lg h-full w-full p-2 overflow-hidden">
						<p class="text-xs text-primary-content font-bold select-none">
							{item.data.id}
						</p>
						<h3 class="text-xl text-primary-content font-bold select-none">{item.id}</h3>
					</div>
				</div>
			</div>
		</Grid>
	</div>
</div>
