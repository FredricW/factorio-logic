<script lang="ts">
	import Grid from '$lib/components/Grid/Grid.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let items = [
		{
			id: '1',
			position: {
				x: -2,
				y: 0
			},
			size: {
				width: 1,
				height: 1
			},
			data: {
				name: 'Button',
				description: 'A button component'
			}
		},
		{
			id: '2',
			position: {
				x: 0,
				y: 1
			},
			size: {
				width: 2,
				height: 1
			},
			data: {
				name: 'InputText',
				description: 'A text input component'
			}
		}
	];

	const addComponent = (event: CustomEvent<{ x: number; y: number }>) => {
		items = [
			...items,
			{
				id: (items.length + 1).toString(),
				position: {
					x: event.detail.x,
					y: event.detail.y
				},
				size: {
					width: 1,
					height: 1
				},
				data: {
					name: 'InputText',
					description: 'A text input component'
				}
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
				<div class="bg-primary rounded shadow-lg h-full w-full p-2">
					<h3 class="text-xl text-primary-content font-bold select-none">{item.id}</h3>
				</div>
			</div>
		</Grid>
	</div>
</div>
