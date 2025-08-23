<script lang="ts">
	type IconSize = 'small' | 'medium' | 'large';
	
	let { 
		size = 'medium',
		contrast = false,
		class: className = '',
		children,
		...restProps
	}: {
		size?: IconSize;
		contrast?: boolean;
		class?: string;
		children: any;
	} = $props();

	const sizeClasses = {
		small: 'w-4 h-4',
		medium: 'w-5 h-5', 
		large: 'w-6 h-6'
	};

	const contrastClasses = contrast 
		? 'text-stone-800 dark:text-stone-100' 
		: '';
</script>

<svg 
	class="{sizeClasses[size]} {contrastClasses} {className}" 
	fill="currentColor" 
	viewBox="0 0 20 20"
	{...restProps}
>
	{@render children()}
</svg>