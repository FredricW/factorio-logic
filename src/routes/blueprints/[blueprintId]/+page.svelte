<script lang="ts">
	import Grid from '$lib/components/Grid/Grid.svelte';
	import type { BlueprintModule, Position } from '$lib/types/blueprint';
	import type { PageData } from './$types';
	import type { GridItem } from '$lib/components/Grid/grid.types';
	import { BlueprintEntity } from '$lib/blueprintEntities';
	import { onMount } from 'svelte';
	import History from '$lib/components/History.svelte';
	import Blueprint from 'factorio-blueprint';
	import type Entity from 'factorio-blueprint/dist/src/entity';
	import Victor from 'victor';

	export let data: PageData;

	let blueprintModule = data.blueprint as BlueprintModule;
	const bp = new Blueprint(data.blueprint?.data);

	let items = bp.entities ?? [];
	$: gridItems = items.map((item) => {
		return {
			id: crypto.randomUUID(),
			position: item.getData().position,
			size: {
				width: item.size.x,
				height: item.size.y
			},
			data: item
		} as GridItem<Entity>;
	});

	const syncBlueprint = () => {
		if (!blueprintModule) return;

		blueprintModule.data = bp.encode();

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

	const moveItem = (event: CustomEvent<GridItem<Entity>>) => {
		if (!blueprintModule) return;
		event.detail.data.position = new Victor(event.detail.position.x, event.detail.position.y);
		syncBlueprint();
	};

	const addComponent = (event: CustomEvent<{ x: number; y: number }>) => {
		if (!blueprintModule) return;

		bp.createEntityWithData(
			{
				name: 'constant_combinator',
				position: new Victor(event.detail.x, event.detail.y)
			},
			false,
			false,
			false
		);
		items = bp.entities;

		syncBlueprint();
	};
	let mousePosition: Position | null = null;
	let hoverMessage: string | null = null;

	let enableHistory = false;

	let containerDiv: HTMLDivElement;
	let borderRadius = '0.5rem';
	onMount(() => {
		borderRadius = getComputedStyle(containerDiv).getPropertyValue('--rounded-btn');
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
		<Grid
			items={gridItems}
			on:dragend={moveItem}
			let:item
			manualDragStart
			let:dragStart
			let:isActive
			let:isOccupied
			on:click={addComponent}
			let:startRopeDragging
		>
			{#if item.data.name === BlueprintEntity.Enum.constant_combinator}
				{@const rectClasses = isActive
					? `${isOccupied ? 'stroke-error' : 'stroke-base-content'}`
					: 'stroke-base-content/20'}
				{@const textClasses = isActive ? 'fill-base-content' : 'fill-base-300'}
				<g class="group">
					<rect
						x="5%"
						y="5%"
						width="90%"
						height="90%"
						class="fill-base-100 outline-none drop-shadow-lg rounded-btn overflow-hidden transition-all {rectClasses}"
						rx={borderRadius}
						on:mouseenter={() => {
							hoverMessage = item.data.name;
						}}
						on:mousedown={(e) => {
							dragStart(e);
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

								bp.removeEntity(item.data);
								items = bp.entities;
								syncBlueprint();
							}
						}}
					/>
					<text
						x="50%"
						y="20%"
						class="text-center transition-all group-hover:fill-base-content group-focus:fill-base-content select-none pointer-events-none {textClasses}"
						dominant-baseline="middle"
						text-anchor="middle"
					>
						CONSTANT
					</text>
					<g class="group/green">
						<circle
							cx="25%"
							cy="75%"
							r="10%"
							class="stroke-base-300 stroke-2 fill-base-100 transition-all group-hover:stroke-success select-none"
						/>
						<circle
							cx="25%"
							cy="75%"
							r="5%"
							class="fill-base-100 group-hover/green:fill-success transition-all"
							on:mousedown={(e) => {
								e.stopPropagation();
								startRopeDragging(e);
							}}
						/>
					</g>
					<g class="group/red">
						<circle
							cx="75%"
							cy="75%"
							r="10%"
							class="stroke-base-300 stroke-2 fill-base-100 transition-all group-hover:stroke-error select-none"
						/>
						<circle
							cx="75%"
							cy="75%"
							r="5%"
							class="fill-base-100 group-hover/red:fill-error transition-all"
							on:mousedown={(e) => {
								e.stopPropagation();
								startRopeDragging(e);
							}}
						/>
					</g>
				</g>
			{/if}
		</Grid>
	</div>
</div>

{#if enableHistory}
	<History {blueprintModule} />
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
