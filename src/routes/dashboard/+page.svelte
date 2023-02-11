<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import InputText from '$lib/components/InputText.svelte';
	import Card from '$lib/components/Card.svelte';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import Navbar from '$lib/components/Navbar.svelte';

	export let data: PageData;

	const isNew = (datestring: string) => {
		const createdAt = new Date(datestring);
		const now = new Date();
		return now.getTime() - createdAt.getTime() < 1000 * 60 * 60 * 24 * 7;
	};
</script>

{#if data.session}
	<Navbar {data} />
{/if}
<div class="max-w-4xl m-auto py-8 px-4">
	<div class="prose mb-8">
		<h1>Dashboard</h1>
	</div>
	{#if data.blueprints && data.blueprints.length > 0}
		<div class="flex gap-8 flex-wrap">
			{#each data.blueprints as blueprint}
				<div class="max-w-[400px] min-w-[250px] flex-1">
					<Card>
						<a href="/blueprints/{blueprint.id}">
							<figure class="my-0 rounded-t-2xl">
								<img
									class="w-full h-32"
									src="https://picsum.photos/300/200"
									alt="Blueprint cover"
								/>
							</figure>
						</a>
						<div class="card-body">
							<h2 class="card-title">
								{blueprint.name}
								{#if isNew(blueprint.created_at)}
									<div class="badge badge-secondary">NEW</div>
								{/if}
							</h2>
							{#if blueprint.description}
								<p>{blueprint.description}</p>
							{/if}
							<div class="card-actions justify-end">
								<div class="badge badge-outline">{blueprint.is_public ? 'Public' : 'Private'}</div>
							</div>
						</div>
					</Card>
				</div>
			{/each}
		</div>
	{:else}
		<p>No blueprints found.</p>
	{/if}
	<div class="mt-8">
		<form method="post" action="?/create" use:enhance>
			<label for="name">Name</label>
			<div class="flex items-start gap-2">
				<InputText name="name" />
				<Button submit>New blueprint</Button>
			</div>
		</form>
	</div>
</div>
