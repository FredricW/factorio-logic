<script lang="ts">
	import Button from '$lib/Button.svelte';
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

<div class="max-w-xl m-auto py-12">
	<h1 class="text-4xl">Account</h1>
	{#if data.session}
		<div class="mt-4">
			<h2 class="text-2xl">Profile</h2>
			<div class="mt-4">
				<p>Email</p>
				<p>{data.session.user.email}</p>
			</div>
		</div>
		<div class="my-4">
			<Button on:click={signOut}>Sign out</Button>
		</div>
	{/if}
</div>
