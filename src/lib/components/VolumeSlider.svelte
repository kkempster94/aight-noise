<script lang="ts">
	type Orientation = 'horizontal' | 'vertical';
	
	let {
		value = $bindable(0),
		orientation = 'horizontal',
		min = 0,
		max = 1,
		step = 0.01,
		class: className = '',
		title,
		id,
		oninput,
		...restProps
	}: {
		value?: number;
		orientation?: Orientation;
		min?: number;
		max?: number;
		step?: number;
		class?: string;
		title?: string;
		id?: string;
		oninput?: (e: Event) => void;
	} = $props();

	const orientationClasses = {
		horizontal: 'w-24 h-2',
		vertical: 'w-2 h-16'
	};

	const orientationStyles = {
		horizontal: '',
		vertical: 'writing-mode: vertical-lr; -webkit-appearance: slider-vertical; transform: rotate(180deg);'
	};
</script>

<style>
	.volume-slider {
		background: rgb(87 83 78); /* stone-600 */
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		outline: none;
		border: none;
		border-radius: 9999px;
	}
	
	/* Track styling */
	.volume-slider::-webkit-slider-track {
		background: rgb(87 83 78); /* stone-600 */
		border-radius: 9999px;
		border: none;
		height: 100%;
	}
	
	.volume-slider::-moz-range-track {
		background: rgb(87 83 78); /* stone-600 */
		border-radius: 9999px;
		border: none;
		height: 100%;
	}
	
	/* Thumb styling */
	/* Range slider styling is handled globally in app.css */
</style>

<input
	{id}
	type="range"
	{min}
	{max}
	{step}
	bind:value
	{oninput}
	{title}
	class="volume-slider cursor-pointer transition-colors {orientationClasses[orientation]} {orientation === 'vertical' ? 'vertical-slider' : ''} {className}"
	style={orientationStyles[orientation]}
	{...restProps}
/>