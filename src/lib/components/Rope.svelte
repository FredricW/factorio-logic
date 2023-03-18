<!-- Rope.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';

	export let start: { x: number; y: number };
	export let end: { x: number; y: number };

	let path: SVGPathElement;

	onMount(() => {
		const updatePath = () => {
			const controlPointX = (start.x + end.x) / 2;
			const controlPointY = Math.max(start.y, end.y) + Math.abs(start.x - end.x) / 2;
			path.setAttribute(
				'd',
				`M${start.x} ${start.y} Q${controlPointX} ${controlPointY}, ${end.x} ${end.y}`
			);

			requestAnimationFrame(updatePath);
		};

		updatePath();
	});
</script>

<path bind:this={path} stroke="white" fill="none" />
