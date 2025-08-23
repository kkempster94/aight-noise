<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { computePosition, flip, shift, offset, autoUpdate } from '@floating-ui/dom';
	import { Arrow } from '$lib';
	
	type ArrowDirection = 'top' | 'top-right' | 'right' | 'bottom-right' | 'bottom' | 'bottom-left' | 'left' | 'top-left';
	
	let {
		text,
		targetElement,
		placement = 'bottom-start',
		class: className = '',
		storageKey = 'tutorial-shown-count',
		maxShows = 2,
		typingSpeed = 100,
		...restProps
	}: {
		text: string;
		targetElement: HTMLElement;
		placement?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end';
		class?: string;
		storageKey?: string;
		maxShows?: number;
		typingSpeed?: number;
	} = $props();

	let displayedText = $state('');
	let shouldShow = $state(false);
	let currentIndex = $state(0);
	let mounted = $state(false);
	let popoverElement = $state<HTMLElement>();
	let typingComplete = $state(false);

	function dismiss() {
		// Mark as dismissed to prevent future shows
		if (browser) {
			localStorage.setItem(`${storageKey}-dismissed`, 'true');
		}
		shouldShow = false;
		console.log('Dismissed, shouldShow is now:', shouldShow);
	}

	// Track if we've already initialized to prevent re-running
	let hasInitialized = $state(false);

	// Determine if we should show immediately
	$effect(() => {
		if (browser && mounted && !hasInitialized) {
			hasInitialized = true;
			const urlParams = new URLSearchParams(window.location.search);
			const showTutorial = urlParams.get('tutorial');
			
			// Check if it was dismissed
			const wasDismissed = localStorage.getItem(`${storageKey}-dismissed`) === 'true';
			
			if (showTutorial === 'true' && !wasDismissed) {
				shouldShow = true;
				startTypingAnimation();
			} else if (!wasDismissed) {
				// Check localStorage for show count
				const shownCount = parseInt(localStorage.getItem(storageKey) || '0');
				
				if (shownCount < maxShows) {
					shouldShow = true;
					// Increment the count
					localStorage.setItem(storageKey, (shownCount + 1).toString());
					startTypingAnimation();
				}
			}
		}
	});

	// Auto-update position to follow target on scroll/resize
	$effect(() => {
		if (shouldShow && popoverElement && targetElement) {
			const cleanup = autoUpdate(targetElement, popoverElement, updatePosition);
			return cleanup;
		}
	});

	async function updatePosition() {
		if (!popoverElement || !targetElement) return;
		
		const { x, y } = await computePosition(targetElement, popoverElement, {
			placement,
			middleware: [offset(10), flip(), shift({ padding: 5 })],
			strategy: 'absolute'
		});

		Object.assign(popoverElement.style, {
			left: `${x}px`,
			top: `${y}px`,
		});
	}

	onMount(() => {
		mounted = true;
		
		// Set up global function to reset all tutorial dismissals
		if (browser && !window.resetTutorials) {
			window.resetTutorials = () => {
				// Find all tutorial-related localStorage keys
				const keysToRemove = [];
				for (let i = 0; i < localStorage.length; i++) {
					const key = localStorage.key(i);
					if (key && (key.includes('-dismissed') || key.includes('tutorial'))) {
						keysToRemove.push(key);
					}
				}
				
				// Remove all tutorial keys
				keysToRemove.forEach(key => localStorage.removeItem(key));
				
				console.log(`Reset ${keysToRemove.length} tutorial settings:`, keysToRemove);
				console.log('Refresh the page to see tutorials again.');
			};
		}
	});

	function startTypingAnimation() {
		typingComplete = false;
		currentIndex = 0;
		displayedText = '';
		
		const interval = setInterval(() => {
			if (currentIndex < text.length) {
				displayedText = text.slice(0, currentIndex + 1);
				currentIndex++;
			} else {
				clearInterval(interval);
				typingComplete = true;
			}
		}, typingSpeed);
	}

	// Debug logging
	$effect(() => {
		console.log('Render check - shouldShow:', shouldShow);
	});

	const arrowPositions = {
		'top': 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full',
		'top-right': 'bottom-0 left-0 transform translate-y-full -translate-x-1/4',
		'right': 'top-1/2 left-0 transform -translate-y-1/2 -translate-x-full',
		'bottom-right': 'top-0 left-0 transform -translate-y-full -translate-x-1/4',
		'bottom': 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-full',
		'bottom-left': 'top-0 right-0 transform -translate-y-full translate-x-1/4',
		'left': 'top-1/2 right-0 transform -translate-y-1/2 translate-x-full',
		'top-left': 'bottom-0 right-0 transform translate-y-full translate-x-1/4'
	};

</script>

<style>
	.terminal-text {
		font-family: 'Courier New', monospace;
		color: #00ff41;
		text-shadow: 0 0 5px #00ff41;
	}

	.dismiss-button {
		position: absolute;
		top: 0px;
		right: 30px;
		width: 16px;
		height: 16px;
		background: transparent;
		color: #00ff41;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		font-weight: bold;
		font-family: 'Courier New', monospace;
		text-shadow: 0 0 3px #00ff41;
		transition: color 0.2s;
	}

	.dismiss-button:hover {
		color: #22ff55;
		text-shadow: 0 0 5px #22ff55;
	}

	.terminal-cursor::after {
		content: '█';
		animation: cursor-blink 1s infinite;
		color: #00ff41;
	}

	@keyframes cursor-blink {
		0%, 50% { opacity: 1; }
		51%, 100% { opacity: 0; }
	}

</style>

{#if shouldShow}
	<div 
		bind:this={popoverElement}
		class="absolute tutorial-popover {className}" 
		style="z-index: 1000; top: 0; left: 0;"
		{...restProps}
	>
		<div class="terminal-text text-sm max-w-xs relative">
			<span class="terminal-cursor">{displayedText}</span>
			{#if typingComplete}
				<button class="dismiss-button" onclick={dismiss} title="Dismiss tutorial">X</button>
			{/if}
		</div>
	</div>
{:else}
	<script>console.log('TutorialPopover hidden - selector: .tutorial-popover')</script>
{/if}