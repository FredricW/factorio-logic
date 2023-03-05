<script lang="ts">
	import { onMount } from 'svelte';
	import type { GridItem } from '../Grid/grid.types';
	import type { Application } from 'pixi.js';
	import * as Pixi from 'pixi.js';
	import type { Mouse } from '@playwright/test';

	type T = $$Generic;
	export let items: GridItem<T>[] = [];

	let view: HTMLCanvasElement;
	let container: HTMLDivElement;
	let app: Application | undefined;
	let sceneContainer: Pixi.Container | undefined;
	let gridTile: Pixi.Graphics | undefined;

	const gridScale = 128;
	const padding = 8;

	onMount(async () => {
		console.log('Pixi', Pixi, 'view', view);
		app = new Pixi.Application({
			view,
			backgroundAlpha: 0,
			resizeTo: container
		});

		// Create a container for the scene
		sceneContainer = new Pixi.Container();
		sceneContainer.interactive = true;

		// Set the initial position and scale
		sceneContainer.position.set(0, 0);
		sceneContainer.scale.set(1, 1);

		if (app.view.addEventListener) {
			// Listen for user input events
			app.view.addEventListener('wheel', (event) => {
				event.preventDefault();
				if (!sceneContainer) return;
				const wheelEvent = event as WheelEvent;
				// Increase or decrease the scale based on the scroll direction
				const delta = wheelEvent.deltaY > 0 ? 0.1 : -0.1;
				sceneContainer.scale.set(sceneContainer.scale.x + delta, sceneContainer.scale.y + delta);
			});

			app.view.addEventListener('mousedown', (event) => {
				console.log('mousedown', event);
				if (!sceneContainer) return;
				const mouseEvent = event as MouseEvent;
				const startPosition = { x: mouseEvent.clientX, y: mouseEvent.clientY };
				const startContainerPosition = {
					x: sceneContainer.position.x,
					y: sceneContainer.position.y
				};

				const onMouseMove = (event: MouseEvent) => {
					if (!sceneContainer) return;
					const dx = event.clientX - startPosition.x;
					const dy = event.clientY - startPosition.y;
					sceneContainer.position.set(startContainerPosition.x + dx, startContainerPosition.y + dy);
				};

				const onMouseUp = () => {
					window.removeEventListener('mousemove', onMouseMove);
					window.removeEventListener('mouseup', onMouseUp);
				};

				window.addEventListener('mousemove', onMouseMove);
				window.addEventListener('mouseup', onMouseUp);
			});
		}

		app.stage.addChild(sceneContainer);

		const tileSize = gridScale;
		const lineColor = 0x555555;
		const lineWidth = 1;

		// Create a Graphics object to draw the tile pattern
		gridTile = new Pixi.Graphics();
		gridTile
			.lineStyle(lineWidth, lineColor, 0.2)
			.moveTo(1, 1)
			.lineTo(0, tileSize)
			.moveTo(1, 1)
			.lineTo(tileSize, 0);

		// Create a RenderTexture to use as the gridTile texture
		const renderTexture = Pixi.RenderTexture.create({ width: tileSize, height: tileSize });
		app.renderer.render(gridTile, { renderTexture });

		// Create a TilingSprite using the RenderTexture
		const tilingSprite = new Pixi.TilingSprite(renderTexture, app.screen.width, app.screen.height);

		// Set the tile scale to control the size of the grid
		tilingSprite.tileScale.set(1);

		// Add the tiling sprite to the stage
		sceneContainer.addChild(tilingSprite);
	});
	$: console.log('items', items);

	$: if (app && sceneContainer) {
		console.log('app', app);

		for (const item of items) {
			let entity = new Pixi.Graphics();

			entity.beginFill(0xffffff);
			entity.drawRoundedRect(
				item.position.x * gridScale + padding,
				item.position.y * gridScale + padding,
				item.size.width * gridScale - padding * 2,
				item.size.height * gridScale - padding * 2,
				8
			);

			entity.interactive = true;
			entity.onclick = () => {
				console.log('clicked', item);
			};

			sceneContainer.addChild(entity);
		}
	}
</script>

<div class="h-full w-full" bind:this={container}>
	<canvas bind:this={view} />
</div>
