<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="max-w-4xl p-4">
	<div class="prose">
		<h1>{data.blueprint?.name}</h1>
	</div>
</div>
