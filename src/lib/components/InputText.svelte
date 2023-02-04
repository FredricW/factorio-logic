<script lang="ts">
	export let value: string;
	export let placeholder: string;
</script>

<input class="bg-white border border-slate-500" type="text" {placeholder} {value} on:click />
