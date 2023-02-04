<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import '../app.css';

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

<div class="bg-gray-200 dark:bg-gray-800 min-h-[100vh] dark:text-white">
	<slot />
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.200);
	}
</style>
