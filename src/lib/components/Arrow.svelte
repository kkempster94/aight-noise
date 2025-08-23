<script lang="ts">
	type ArrowDirection = 'top' | 'top-right' | 'right' | 'bottom-right' | 'bottom' | 'bottom-left' | 'left' | 'top-left';
	
	let {
		direction = 'bottom',
		class: className = '',
		...restProps
	}: {
		direction?: ArrowDirection;
		class?: string;
	} = $props();

	const arrowRotations = {
		'top': 'rotate-0',
		'top-right': 'rotate-45',
		'right': 'rotate-90',
		'bottom-right': 'rotate-135',
		'bottom': 'rotate-180',
		'bottom-left': 'rotate-225',
		'left': 'rotate-270',
		'top-left': 'rotate-315'
	};

	const arrowAnimationClasses = {
		'top': 'arrow-top',
		'top-right': 'arrow-top-right',
		'right': 'arrow-right',
		'bottom-right': 'arrow-bottom-right',
		'bottom': 'arrow-bottom',
		'bottom-left': 'arrow-bottom-left',
		'left': 'arrow-left',
		'top-left': 'arrow-top-left'
	};

</script>

<style>
	.arrow {
		position: relative;
		display: inline-block;
		animation-duration: 2s;
		animation-timing-function: ease-in-out;
		animation-iteration-count: infinite;
	}

	.arrow::before {
		content: '';
		width: 0;
		height: 0;
		border-left: 8px solid transparent;
		border-right: 8px solid transparent;
		border-top: 12px solid #00ff41;
		filter: drop-shadow(0 0 3px rgba(0, 255, 65, 0.5));
		position: absolute;
		top: 0;
		left: 0;
	}


	/* Arrow directions - point toward target */
	.arrow-top-right {
		transform: rotate(-90deg); /* Arrow points right toward target */
	}

	.arrow-top { animation-name: arrow-point-top; }
	.arrow-top-right { animation-name: arrow-point-top-right; }
	.arrow-right { animation-name: arrow-point-right; }
	.arrow-bottom-right { animation-name: arrow-point-bottom-right; }
	.arrow-bottom { animation-name: arrow-point-bottom; }
	.arrow-bottom-left { animation-name: arrow-point-bottom-left; }
	.arrow-left { animation-name: arrow-point-left; }
	.arrow-top-left { animation-name: arrow-point-top-left; }

	@keyframes arrow-point-top {
		0%, 100% { transform: translateX(0px); }
		50% { transform: translateX(3px); }
	}
	@keyframes arrow-point-top-right {
		0%, 100% { transform: translateX(0px); }
		50% { transform: translateX(3px); }
	}
	@keyframes arrow-point-right {
		0%, 100% { transform: translateX(0px); }
		50% { transform: translateX(3px); }
	}
	@keyframes arrow-point-bottom-right {
		0%, 100% { transform: translateX(0px); }
		50% { transform: translateX(3px); }
	}
	@keyframes arrow-point-bottom {
		0%, 100% { transform: translateX(0px); }
		50% { transform: translateX(3px); }
	}
	@keyframes arrow-point-bottom-left {
		0%, 100% { transform: translateX(0px); }
		50% { transform: translateX(3px); }
	}
	@keyframes arrow-point-left {
		0%, 100% { transform: translateX(0px); }
		50% { transform: translateX(3px); }
	}
	@keyframes arrow-point-top-left {
		0%, 100% { transform: translateX(0px); }
		50% { transform: translateX(3px); }
	}
</style>

<div class="arrow {arrowAnimationClasses[direction]} {className}" {...restProps}></div>