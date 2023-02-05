<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import type { PageData } from '../../routes/$types';
	import LogoWhite from '$lib/assets/icon-ic-100-outline-white.png';
	import Logo from '$lib/assets/icon-ic-100-outline.png';

	export let data: PageData;

	let profileImageUrl = data.profile?.avatar_url ?? '';

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

<div class="p-4">
	<div class="navbar bg-base-100 rounded-box shadow-xl">
		<div class="flex-1">
			<a href="/" class="btn btn-ghost normal-case text-xl">
				<img class="h-8 w-8 dark:visible hidden" src={LogoWhite} alt="Factorio Logic logo" />
				<img class="h-8 w-8 dark:hidden" src={Logo} alt="Factorio Logic logo" />
			</a>
		</div>
		<div class="flex-none">
			<div class="dropdown dropdown-end">
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label tabindex="0" class="btn btn-ghost btn-circle avatar">
					<div class="w-10 rounded-full">
						<img src={profileImageUrl} alt="Avatar" />
					</div>
				</label>
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<ul
					tabindex="0"
					class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
				>
					<li>
						<a href="/account" class="justify-between">Account</a>
					</li>
					<!-- svelte-ignore a11y-invalid-attribute -->
					<li><a href="#" on:click={signOut}>Sign out</a></li>
				</ul>
			</div>
		</div>
	</div>
</div>
