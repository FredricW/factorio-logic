<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';
	import GithubIconWhite from '$lib/assets/icon-github-white.svg';
	import { supabase } from '$lib/supabaseClient';

	const signIn = async () => {
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: 'github'
			});
			if (error) throw error;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		}
	};
</script>

<div class="max-w-md m-auto h-screen p-4 flex items-center">
	<Card>
		<div class="card-body">
			<form>
				<div class="prose">
					<h1 class="text-center">Factorio Logic</h1>
				</div>
				<div class="divider" />
				<Button className="btn-block gap-3" on:click={signIn}>
					<img class="h-5 w-5" src={GithubIconWhite} alt="Github icon" />Login with Github
				</Button>
			</form>
		</div>
	</Card>
</div>
