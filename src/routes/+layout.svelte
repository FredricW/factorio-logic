<script lang="ts">
	import { invalidate, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import '../app.css';

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange(() => {
			// invalidate('supabase:auth');
			invalidateAll();
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<div class="bg-base-200 min-h-[100vh]">
	<slot />
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.200);
	}
</style>
