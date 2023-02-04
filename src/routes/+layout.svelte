<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<div class="bg-base-200 min-h-[100vh]">
	{#if data.session}
		<Navbar {data} />
	{/if}
	<slot />
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.200);
	}
</style>
