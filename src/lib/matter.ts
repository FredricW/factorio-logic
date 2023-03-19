import { writable } from 'svelte/store';

export const matterEngine = writable<Matter.Engine | null>(null);
