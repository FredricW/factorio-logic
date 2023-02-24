<script lang="ts">
	import { createBlueprintItem, deleteBlueprintItem, updateBlueprintData } from '$lib/blueprint';
	import Grid from '$lib/components/Grid/Grid.svelte';
	import type { BlueprintItem, Position } from '$lib/types/blueprint';
	import { fly } from 'svelte/transition';
	import type { PageData } from './$types';
	import type { GridItem } from '$lib/components/Grid/grid.types';
	import { BlueprintEntity } from '$lib/blueprintEntities';
	import { onMount } from 'svelte';

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
	let containerDiv: HTMLDivElement;
	let borderRadius = '0.5rem';
	onMount(() => {
		const newRadius = getComputedStyle(containerDiv).getPropertyValue('--rounded-btn');
		console.log('newRadius', newRadius);
		borderRadius = newRadius;
	});
</script>

<svelte:window on:mousemove={(e) => (mousePosition = { x: e.clientX, y: e.clientY })} />

<div bind:this={containerDiv} class="max-w-screen-2xl m-auto">
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
			{#if item.data.entity === BlueprintEntity.Enum.constant_combinator}
				<g class="group">
					<rect
						x="5%"
						y="5%"
						width="90%"
						height="90%"
						class="fill-base-100 stroke-base-content/20 group-hover:stroke-base-content drop-shadow-lg focus:outline-accent rounded-btn overflow-hidden transition-all"
						rx={borderRadius}
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
						on:keydown={(e) => {
							// delete item on backspace
							if (e.key === 'Backspace') {
								if (!blueprintModule) return;

								blueprintModule = deleteBlueprintItem(blueprintModule, item.id);
								syncBlueprint();
							}
						}}
					/>
					<text
						x="50%"
						y="20%"
						class="fill-base-300 text-center transition-all group-hover:fill-base-content group-focus:fill-base-content select-none pointer-events-none"
						dominant-baseline="middle"
						text-anchor="middle"
					>
						CONSTANT
					</text>
					<circle
						cx="25%"
						cy="75%"
						r="10%"
						class="stroke-base-300 stroke-2 fill-none transition-all group-hover:stroke-success group-focus:fill-base-content select-none"
					/>
					<circle
						cx="75%"
						cy="75%"
						r="10%"
						class="stroke-base-300 stroke-2 fill-none transition-all group-hover:stroke-error group-focus:fill-base-content select-none"
					/>
				</g>
			{/if}
		</Grid>
	</div>
</div>

{#if enableHistory}
	<div
		transition:fly={{ x: 30, duration: 150 }}
		class="fixed right-0 top-0 h-full flex items-center pointer-events-none"
	>
		<div class="pr-4 pointer-events-auto">
			<div
				class="shadow-2xl bg-base-200 max-h-[80vh] overflow-y-auto border-2 border-base-100 rounded-box"
			>
				{#if !blueprintModule?.history || blueprintModule.history.length === 0}
					<div class="prose">
						<p class="px-4">No history</p>
					</div>
				{:else}
					<table class="table my-0 table-compact w-full h-full">
						<thead class="sticky top-0">
							<tr>
								<th>Timestamp</th>
								<th>Id</th>
							</tr>
						</thead>
						<tbody class="overflow-y-auto">
							{#each blueprintModule.history.reverse() as history}
								<tr class="hover cursor-pointer">
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
	</div>
{/if}

<!-- {#if mousePosition && hoverMessage}
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
{/if} -->
