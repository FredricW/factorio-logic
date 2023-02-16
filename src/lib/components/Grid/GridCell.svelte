<script lang="ts">
	import type { Rectangle } from './grid.types';

	export let rectangle: Rectangle;
	export let markerWidth = 0.5;
	export let markerLength = 8;

	$: x = rectangle.x;
	$: y = rectangle.y;
	$: width = rectangle.width;
	$: height = rectangle.height;
</script>

<g>
	<rect
		{x}
		{y}
		{width}
		{height}
		on:click
		on:keydown
		on:keyup
		on:keypress
		on:mouseenter
		on:mouseleave
		class="fill-base-200 transition-all hover:shadow-2xl hover:fill-base-100 cursor-pointer stroke-[0.5] stroke-base-100"
	/>

	<line
		x1={x}
		y1={y}
		x2={x + markerLength}
		y2={y}
		stroke-width={markerWidth}
		class="stroke-base-content/10"
	/>
	<line
		x1={x}
		y1={y}
		x2={x}
		y2={y + markerLength}
		stroke-width={markerWidth}
		class="stroke-base-content/10"
	/>

	<line
		x1={x + width}
		y1={y + height}
		x2={x + width - markerLength}
		y2={y + height}
		stroke-width={markerWidth}
		class="stroke-base-content/10"
	/>
	<line
		x1={x + width}
		y1={y + height}
		x2={x + width}
		y2={y + height - markerLength}
		stroke-width={markerWidth}
		class="stroke-base-content/10"
	/>

	<line
		x1={x + width}
		y1={y}
		x2={x + width}
		y2={y + markerLength}
		stroke-width={markerWidth}
		class="stroke-base-content/10"
	/>
	<line
		x1={x + width}
		y1={y}
		x2={x + width - markerLength}
		y2={y}
		stroke-width={markerWidth}
		class="stroke-base-content/10"
	/>

	<line
		x1={x}
		y1={y + height}
		x2={x + markerLength}
		y2={y + height}
		stroke-width={markerWidth}
		class="stroke-base-content/10"
	/>
	<line
		x1={x}
		y1={y + height}
		x2={x}
		y2={y + height - markerLength}
		stroke-width={markerWidth}
		class="stroke-base-content/10"
	/>
</g>
