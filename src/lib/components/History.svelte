<script lang="ts">
	import type { BlueprintModule } from '$lib/types/blueprint';
	import { fly } from 'svelte/transition';

	export let blueprintModule: BlueprintModule | undefined;

	const toCompactDate = (datestring: string) => {
		const date = new Date(datestring);
		return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
	};
</script>

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
