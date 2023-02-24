<script lang="ts">
	import type { BlueprintModule } from '$lib/types/blueprint';
	import { fly } from 'svelte/transition';

	export let blueprintModule: BlueprintModule | undefined;

	const toCompactDate = (datestring: string) => {
		const date = new Date(datestring);
		return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
	};
	let currentHistoryId: string | null = null;
	let activeTooltip: string | null = null;
	// limit history to 10 items
	$: history = blueprintModule?.history?.slice(0, 10) ?? [];
</script>

<div
	transition:fly={{ x: 30, duration: 150 }}
	class="fixed right-0 top-0 h-full flex items-center pointer-events-none"
>
	<div class="pr-4 pointer-events-auto group">
		<div class="shadow-2xl bg-base-200 max-h-[80vh] overflow-y-auto border-base-100 rounded-box">
			{#if !blueprintModule?.history || blueprintModule.history.length === 0}
				<div class="prose">
					<p class="px-4">No history</p>
				</div>
			{:else}
				<div
					on:mouseleave={() => {
						activeTooltip = null;
					}}
					class="btn-group btn-group-vertical"
				>
					{#each history as historyItem, i (historyItem.id)}
						<button
							class="btn w-10"
							class:btn-accent={currentHistoryId ? currentHistoryId === historyItem.id : i === 0}
							on:click={() => {
								currentHistoryId = historyItem.id;
							}}
							on:mouseenter={() => {
								activeTooltip = historyItem.id;
							}}
							>{i}
							<span
								class="tooltip tooltip-left absolute left-0 transition-all"
								class:tooltip-open={activeTooltip === historyItem.id}
								data-tip={toCompactDate(historyItem.timestamp)}><div /></span
							>
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
