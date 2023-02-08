<script lang="ts">
	export let value = '';
	export let placeholder = '';
	export let label = '';
	export let name = '';
	export let id = '';
</script>

<div class="form-control w-full max-w-xs">
	{#if label}
		<label class="label" for={name}>
			<span class="label-text">{label}</span>
		</label>
	{/if}
	<input
		type="text"
		{placeholder}
		{value}
		{id}
		{name}
		on:click
		class="input input-bordered w-full max-w-xs"
	/>
</div>
