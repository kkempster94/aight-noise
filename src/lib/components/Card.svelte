<script lang="ts">
	import { ColorDot } from '$lib';
	
	type CardSize = 'compact' | 'standard';
	
	let {
		size = 'standard',
		color,
		title,
		children,
		actions,
		class: className = '',
		onclick,
		...restProps
	}: {
		size?: CardSize;
		color?: string;
		title?: string;
		children?: any;
		actions?: any;
		class?: string;
		onclick?: (e: Event) => void;
	} = $props();

	const baseClasses = 'rounded-lg transition-all duration-200 border';
	
	const sizeClasses = {
		compact: 'p-3 bg-stone-800 hover:bg-stone-700 border-stone-600 hover:shadow-sm',
		standard: 'p-4 bg-stone-700 hover:bg-stone-600 border-stone-500 hover:shadow-sm aspect-[3/2]'
	};
</script>

{#if size === 'compact'}
	<button
		{onclick}
		class="{baseClasses} {sizeClasses[size]} {className} w-full flex items-center gap-3"
		{...restProps}
	>
		{#if color}
			<ColorDot {color} size="medium" class="flex-shrink-0" />
		{/if}
		
		{#if title}
			<span class="text-sm font-medium text-stone-100 flex-grow text-left">
				{title}
			</span>
		{/if}
		
		{#if children}
			<div class="flex-grow">
				{@render children()}
			</div>
		{/if}
		
		{#if actions}
			<div class="flex items-center justify-center gap-2 ml-auto flex-shrink-0">
				{@render actions()}
			</div>
		{/if}
	</button>
{:else}
	<div
		class="{baseClasses} {sizeClasses[size]} {className} flex flex-col items-center justify-center gap-3"
		{...restProps}
	>
		<!-- Row 1: Icon/Color and Title -->
		<div class="flex items-center justify-between w-full">
			<div class="flex items-center gap-2">
				{#if color}
					<ColorDot {color} size="small" />
				{/if}
				{#if title}
					<h3 class="text-xs font-medium text-stone-100 truncate">
						{title}
					</h3>
				{/if}
			</div>
			{#if actions}
				<div class="flex items-center">
					{@render actions()}
				</div>
			{/if}
		</div>

		<!-- Row 2: Slider Content -->
		{#if children}
			<div class="flex flex-col items-center gap-2 flex-1">
				{@render children()}
			</div>
		{/if}
	</div>
{/if}