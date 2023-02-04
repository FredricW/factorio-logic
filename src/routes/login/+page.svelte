<script lang="ts">
	import Button from '$lib/Button.svelte';
	import { supabase } from '$lib/supabaseClient';

	let loading = false;
	let email: string;

	const handleLogin = async () => {
		try {
			loading = true;
			const { error } = await supabase.auth.signInWithOtp({ email });
			if (error) throw error;
			alert('Check your email for the login link!');
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	};

	const loginWithGithub = async () => {
		try {
			loading = true;
			const { error } = await supabase.auth.signInWithOAuth({
				provider: 'github',
				options: { redirectTo: 'http://localhost:5173/account' }
			});
			if (error) throw error;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	};
</script>

<div class="max-w-md m-auto h-screen p-4 flex items-center">
	<form
		class="bg-gray-50 dark:bg-slate-700 px-6 py-12 rounded shadow-xl w-full"
		on:submit|preventDefault={loginWithGithub}
	>
		<h1 class="text-4xl uppercase font-bold text-slate-700 dark:text-white/90 text-center">
			Factorio Logic
		</h1>
		<div class="w-full h-[1px] bg-slate-300/50 my-6" />
		<Button>Login with Github</Button>
	</form>
</div>
