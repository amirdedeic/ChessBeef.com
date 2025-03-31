import { writable } from 'svelte/store';

// Store for tracking the current page
export const page = writable('home');