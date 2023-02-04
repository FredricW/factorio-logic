<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';
	import GithubIcon from '$lib/assets/icon-github.svg';
	import GithubIconWhite from '$lib/assets/icon-github-white.svg';
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
	<Card>
		<div class="card-body">
			<form on:submit|preventDefault={loginWithGithub}>
				<div class="prose">
					<h1 class="text-center">Factorio Logic</h1>
				</div>
				<div class="divider" />
				<Button className="btn-block gap-3"
					><img class="h-5 w-5" src={GithubIconWhite} alt="Github icon" />Login with Github</Button
				>
			</form>
		</div>
	</Card>
</div>
