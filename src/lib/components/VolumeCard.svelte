<script lang="ts">
	import { ColorDot } from '$lib';

	let {
		title,
		color,
		volume = $bindable(0),
		isPlaying = false,
		width = 'wide',
		class: className = '',
		onVolumeChange,
		...restProps
	}: {
		title: string;
		color?: string;
		volume?: number;
		isPlaying?: boolean;
		width?: 'wide' | 'narrow';
		class?: string;
		onVolumeChange?: (volume: number) => void;
	} = $props();

	let cardElement: HTMLDivElement;

	let isDragging = false;
	let showPercentage = $state(false);
	let percentageTimeout: ReturnType<typeof setTimeout>;

	const widthClasses = {
		wide: 'aspect-[3/2]',
		narrow: 'aspect-[1/2]'
	};

	function handleMouseDown(event: MouseEvent) {
		isDragging = true;
		updateVolume(event.clientY);
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
		event.preventDefault();
	}

	function handleMouseMove(event: MouseEvent) {
		if (isDragging) {
			updateVolume(event.clientY);
		}
	}

	function handleMouseUp() {
		isDragging = false;
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
	}

	function handleTouchStart(event: TouchEvent) {
		isDragging = true;
		updateVolume(event.touches[0].clientY);
		document.addEventListener('touchmove', handleTouchMove);
		document.addEventListener('touchend', handleTouchEnd);
		event.preventDefault();
	}

	function handleTouchMove(event: TouchEvent) {
		if (isDragging) {
			updateVolume(event.touches[0].clientY);
		}
	}

	function handleTouchEnd() {
		isDragging = false;
		document.removeEventListener('touchmove', handleTouchMove);
		document.removeEventListener('touchend', handleTouchEnd);
	}

	function updateVolume(clientY: number) {
		if (!cardElement) return;
		
		const rect = cardElement.getBoundingClientRect();
		const y = clientY - rect.top;
		// Invert the calculation so top = 100% and bottom = 0%
		const newVolume = Math.max(0, Math.min(1, 1 - (y / rect.height)));
		
		volume = newVolume;
		if (onVolumeChange) {
			onVolumeChange(newVolume);
		}

		// Show percentage during volume change
		showPercentage = true;
		clearTimeout(percentageTimeout);
		percentageTimeout = setTimeout(() => {
			showPercentage = false;
		}, 1500); // Hide after 1.5 seconds
	}

	function handleClick(event: MouseEvent) {
		if (!isDragging) {
			updateVolume(event.clientY);
		}
	}
</script>

<style>
	.electric-glow {
		position: relative;
		overflow: hidden;
	}
	
	.electric-glow::before {
		content: '';
		position: absolute;
		bottom: -50%;
		left: 0;
		right: 0;
		top: -50%;
		background: linear-gradient(
			0deg,
			transparent 0%,
			rgba(59, 130, 246, 0.8) 20%,
			rgba(147, 197, 253, 0.9) 50%,
			rgba(59, 130, 246, 0.8) 80%,
			transparent 100%
		);
		animation: electric-crackle-vertical 1.8s linear infinite;
		pointer-events: none;
		height: 30%;
	}
	
	.electric-glow::after {
		content: '';
		position: absolute;
		bottom: -50%;
		left: 0;
		right: 0;
		top: -50%;
		background: linear-gradient(
			0deg,
			transparent 0%,
			rgba(147, 197, 253, 0.6) 30%,
			rgba(59, 130, 246, 0.7) 50%,
			rgba(147, 197, 253, 0.6) 70%,
			transparent 100%
		);
		animation: electric-crackle-vertical 2.2s linear infinite reverse;
		pointer-events: none;
		height: 20%;
		animation-delay: -1s;
	}
	
	@keyframes electric-crackle {
		0% {
			transform: translateX(-200%) skewX(-10deg);
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		90% {
			opacity: 1;
		}
		100% {
			transform: translateX(200%) skewX(10deg);
			opacity: 0;
		}
	}

	@keyframes electric-crackle-vertical {
		0% {
			transform: translateY(-200%) skewY(-10deg);
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		90% {
			opacity: 1;
		}
		100% {
			transform: translateY(200%) skewY(10deg);
			opacity: 0;
		}
	}
</style>

<div
	bind:this={cardElement}
	class="rounded-lg transition-all duration-200 border border-stone-500 hover:shadow-sm {widthClasses[width]} relative overflow-hidden cursor-pointer select-none {className}"
	onmousedown={handleMouseDown}
	ontouchstart={handleTouchStart}
	onclick={handleClick}
	{...restProps}
>
	<!-- Main background -->
	<div class="absolute inset-0 bg-stone-800"></div>
	
	<!-- Volume background (grey fill from bottom based on volume) -->
	<div 
		class="absolute inset-0 bg-stone-600/40 origin-bottom {!isDragging ? 'transition-transform duration-75' : ''}"
		style="transform: scaleY({volume});"
	></div>
	
	<!-- Volume indicator line -->
	<div 
		class="absolute left-0 right-0 h-0.5 bg-gray-400 shadow-sm {!isDragging ? 'transition-all duration-75' : ''}"
		style="bottom: {volume * 100}%"
	></div>
	
	<!-- Content -->
	<div class="relative z-20 p-4 h-full flex flex-col justify-between">
		<!-- Header -->
		<div class="flex items-center gap-2">
			{#if color}
				<ColorDot {color} size="small" />
			{/if}
			<h3 class="text-xs font-medium text-stone-100 truncate">
				{title}
			</h3>
		</div>
		
		<!-- Bottom status -->
		<div class="flex items-center justify-between">
		</div>
	</div>
	
	<!-- Overlay percentage (centered and large) -->
	<div class="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
		<span class="text-2xl font-bold text-stone-100 transition-opacity duration-300" class:opacity-0={!showPercentage} class:opacity-100={showPercentage}>
			{Math.round(volume * 100)}%
		</span>
	</div>
</div>