<!-- Rope.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import Matter from 'matter-js';
	import { matterEngine } from '../matter';

	export let start: { x: number; y: number };
	export let end: { x: number; y: number };
	export let segments = 16;

	let pathData = '';
	let ropeBodies: Matter.Body[];

	let startBody: Matter.Body;
	let endBody: Matter.Body;

	onMount(() => {
		// Create the rope
		createRope(start, end, segments);

		// Render the rope
		const updateRope = () => {
			pathData = [startBody, ...ropeBodies, endBody]
				.map((body, index) => {
					const command = index === 0 ? 'M' : 'L';
					return `${command}${body.position.x},${body.position.y}`;
				})
				.join(' ');

			requestAnimationFrame(updateRope);
		};

		updateRope();
	});

	function createRope(
		start: { x: number; y: number },
		end: { x: number; y: number },
		segments: number
	): void {
		if (!$matterEngine) return;

		const ropeLength = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
		const segmentLength = ropeLength / segments;

		// Create a static body for each end of the rope
		startBody = Matter.Bodies.circle(start.x, start.y, 1, { isStatic: true });
		endBody = Matter.Bodies.circle(end.x, end.y, 1, { isStatic: true });

		// Create the rope bodies
		ropeBodies = Array.from({ length: segments }, (_, i) => {
			const x = start.x + ((end.x - start.x) / segments) * i;
			const y = start.y + ((end.y - start.y) / segments) * i;
			return Matter.Bodies.circle(x, y, 1);
		});

		// Connect the rope bodies with constraints
		const constraints = ropeBodies.map((body, i) => {
			const prevBody = i === 0 ? startBody : ropeBodies[i - 1];
			return Matter.Constraint.create({
				bodyA: prevBody,
				bodyB: body,
				length: segmentLength,
				stiffness: 0.8,
				damping: 0.1
			});
		});

		// Connect the last rope body to the end body
		constraints.push(
			Matter.Constraint.create({
				bodyA: ropeBodies[ropeBodies.length - 1],
				bodyB: endBody,
				length: segmentLength,
				stiffness: 0.8,
				damping: 0.1
			})
		);

		// Add all bodies and constraints to the engine
		Matter.World.add($matterEngine.world, [startBody, endBody, ...ropeBodies, ...constraints]);
	}
	$: if ($matterEngine && startBody && endBody) {
		// Update the startBody position
		Matter.Body.setPosition(startBody, start);

		// Update the endBody position
		Matter.Body.setPosition(endBody, end);
	}
</script>

<path d={pathData} stroke="white" fill="none" stroke-width={2} />
