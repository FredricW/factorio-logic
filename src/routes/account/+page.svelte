<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import { supabase } from '$lib/supabaseClient';
	import type { PageData } from './$types';
	export let data: PageData;

	const signOut = async () => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		}
	};
</script>

{#if data.session}
	<Navbar {data} />
{/if}
<div class="max-w-xl m-auto py-12 px-4">
	<div class="prose mb-4">
		<h1>Account</h1>
	</div>
	{#if data.session}
		<div class="stats shadow my-4">
			<div class="stat">
				<div class="stat-title">Email</div>
				<p>{data.session.user.email}</p>
			</div>
		</div>
		<div class="my-4">
			<Button on:click={signOut}>Sign out</Button>
		</div>
	{/if}
</div>
