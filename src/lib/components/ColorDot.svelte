<script lang="ts">
	let {
		color,
		size = 'small',
		class: className = '',
		...restProps
	}: {
		color: string;
		size?: 'small' | 'medium';
		class?: string;
	} = $props();

	const sizeClasses = {
		small: 'w-3 h-3',
		medium: 'w-4 h-4'
	};
</script>

<div
	class="rounded-full border border-stone-500 shadow-sm {sizeClasses[size]} {className}"
	style="background-color: {color}"
	{...restProps}
></div>