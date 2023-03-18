<!-- Rope.svelte -->
<script lang="ts">
	// Replace this with your actual import statement
	// import { Position } from "$lib/types/blueprint";
	type Position = {
		x: number;
		y: number;
	};

	export let start: Position;
	export let end: Position;

	let ropePath: SVGPathElement;

	$: {
		if (ropePath) {
			drawRope(start, end);
		}
	}

	function drawRope(start: Position, end: Position): void {
		const controlPoint = {
			x: (start.x + end.x) / 2,
			y: Math.max(start.y, end.y) + Math.abs(start.x - end.x) / 4
		};

		const pathData = `M ${start.x} ${start.y} Q ${controlPoint.x} ${controlPoint.y} ${end.x} ${end.y}`;
		ropePath.setAttribute('d', pathData);
	}
</script>

<path bind:this={ropePath} stroke="white" fill="none" stroke-width="2" />
