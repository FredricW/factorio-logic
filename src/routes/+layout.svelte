<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { page } from '$app/stores';
	import '../app.css';
	import { redirect } from '@sveltejs/kit';

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

	if (!$page.data.session && $page.url.pathname !== '/login') {
		throw redirect(301, '/login');
	}
</script>

<div class="bg-gray-200 dark:bg-gray-800 min-h-[100vh]">
	<slot />
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.200);
	}
</style>
