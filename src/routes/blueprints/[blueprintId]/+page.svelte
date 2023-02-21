<script lang="ts">
	import Grid from '$lib/components/Grid/Grid.svelte';
	import type { Blueprint } from '$lib/types/blueprint';
	import FactorioBlueprint from 'factorio-blueprint';
	import type { PageData } from './$types';

	export let data: PageData;

	let blueprint: any = null;
	if (data?.blueprint?.data) {
		try {
			blueprint = new FactorioBlueprint(data?.blueprint?.data);
		} catch (e) {
			console.error(e);
		}
	} else {
		blueprint = new FactorioBlueprint();
	}

	let items =
		blueprint?.entities.map(
			(
				entity: { entity_number: { toString: () => any }; position: { x: any; y: any } },
				index: { toString: () => any }
			) => {
				return {
					id: entity.entity_number.toString() + index.toString(),
					position: {
						x: entity.position.x,
						y: entity.position.y
					},
					size: {
						width: 1,
						height: 1
					},
					data: entity
				};
			}
		) || [];

	const addComponent = (event: CustomEvent<{ x: number; y: number }>) => {
		const newEntity = blueprint?.createEntity('constant-combinator', {
			x: event.detail.x,
			y: event.detail.y
		});

		items = [
			...items,
			{
				id: (items.length + 1).toString(),
				position: {
					x: event.detail.x,
					y: event.detail.y
				},
				size: {
					width: newEntity.size.x,
					height: newEntity.size.y
				},
				data: newEntity
			}
		];
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
		<Grid bind:items let:item on:click={addComponent}>
			<div class="p-1 w-full h-full">
				<div class="tooltip w-full h-full" data-tip={item.data.name}>
					<div class="bg-primary rounded shadow-lg h-full w-full p-2 overflow-hidden">
						<p class="text-xs text-primary-content font-bold select-none">
							{item.data.name}
						</p>
						<h3 class="text-xl text-primary-content font-bold select-none">{item.id}</h3>
					</div>
				</div>
			</div>
		</Grid>
	</div>
</div>
