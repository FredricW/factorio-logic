<script lang="ts">
	import { createBlueprintItem, updateBlueprintData } from '$lib/blueprint';
	import Grid from '$lib/components/Grid/Grid.svelte';
	import type { BlueprintItem, Position } from '$lib/types/blueprint';
	import { fade } from 'svelte/transition';
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

	const syncBlueprint = () => {
		if (!blueprintModule) return;

		fetch(`/blueprints/${blueprintModule.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				data: blueprintModule
			})
		});
	};

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
		syncBlueprint();
	};

	const addComponent = (event: CustomEvent<{ x: number; y: number }>) => {
		if (!blueprintModule) return;

		blueprintModule = createBlueprintItem(blueprintModule, 'constant_combinator', {
			x: event.detail.x,
			y: event.detail.y
		});
		syncBlueprint();
	};
	let mousePosition: Position | null = null;
	let hoverMessage: string | null = null;

	let enableHistory = false;

	const toCompactDate = (datestring: string) => {
		const date = new Date(datestring);
		return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
	};
</script>

<svelte:window on:mousemove={(e) => (mousePosition = { x: e.clientX, y: e.clientY })} />

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
			<label class="cursor-pointer label">
				<span class="label-text">History</span>
				<input
					type="checkbox"
					class="toggle toggle-primary"
					on:change={(e) => {
						enableHistory = e.currentTarget.checked;
					}}
					checked={enableHistory}
				/>
			</label>
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
			<div
				class="p-1 w-full h-full"
				on:mouseenter={(e) => {
					hoverMessage = item.data.entity;
				}}
				on:mouseleave={(e) => {
					mousePosition = null;
					hoverMessage = null;
				}}
				on:focus={(e) => {
					// console.log(e);
				}}
			>
				<div class="bg-primary rounded shadow-lg h-full w-full p-2 overflow-hidden">
					<p class="text-xs text-primary-content font-bold select-none">
						{item.data.id}
					</p>
					<h3 class="text-xl text-primary-content font-bold select-none">{item.id}</h3>
				</div>
			</div>
		</Grid>
	</div>
</div>

{#if enableHistory}
	<div class="fixed right-0 top-0 h-full flex items-center pointer-events-none">
		<div class="bg-base-100 rounded-l p-4 max-h-[80vh] overflow-scroll prose pointer-events-auto">
			<h3 class="text-center">History</h3>
			{#if !blueprintModule?.history || blueprintModule.history.length === 0}
				<p>No history</p>
			{:else}
				<table class="table table-compact w-full">
					<thead>
						<tr>
							<th>Timestamp</th>
							<th>Id</th>
						</tr>
					</thead>
					<tbody>
						{#each blueprintModule.history as history}
							<tr>
								<td>{toCompactDate(history.timestamp)}</td>
								<td title={history.id}
									><span class="text-ellipsis block w-16 overflow-hidden">{history.id}</span></td
								>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>
	</div>
{/if}

{#if mousePosition && hoverMessage}
	<div
		class="absolute z-50 pointer-events-none"
		style:left={mousePosition.x + 'px'}
		style:top={mousePosition.y + 'px'}
		transition:fade={{ duration: 100 }}
	>
		<div class="-mt-8">
			<div class="tooltip tooltip-open -mt-4" data-tip={hoverMessage}>
				<div class="-mt-4" />
			</div>
		</div>
	</div>
{/if}
