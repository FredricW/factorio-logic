<script lang="ts">
	export let loading = false;
	export let className = '';
</script>

<button class={'btn ' + className} class:loading on:click>
	<slot />
</button>
