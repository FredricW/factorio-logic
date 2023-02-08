<script lang="ts">
	export let loading = false;
	export let className = '';
	export let submit = false;
</script>

<button class={'btn ' + className} type={submit ? 'submit' : 'button'} class:loading on:click>
	<slot />
</button>
