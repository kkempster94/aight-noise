<script lang="ts">
	type IconButtonSize = 'small' | 'medium' | 'large';
	type IconButtonVariant = 'primary' | 'secondary';
	
	let { 
		size = 'medium',
		variant = 'secondary',
		contrast = false,
		class: className = '',
		onclick,
		children,
		...restProps
	}: {
		size?: IconButtonSize;
		variant?: IconButtonVariant;
		contrast?: boolean;
		class?: string;
		onclick?: (e: Event) => void;
		children: any;
	} = $props();

	const sizeClasses = {
		small: 'p-2 w-8 h-8 flex-shrink-0',
		medium: 'p-3',
		large: 'p-4'
	};

	const variantClasses = {
		primary: contrast 
			? 'bg-stone-600 hover:bg-stone-500 text-white'
			: 'bg-stone-700 hover:bg-stone-600 text-white',
		secondary: contrast
			? 'bg-stone-700 text-stone-200 hover:bg-stone-600'
			: 'bg-stone-800 text-stone-200 hover:bg-stone-700'
	};
</script>

<button 
	{onclick}
	class="rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center {sizeClasses[size]} {variantClasses[variant]} {className}"
	{...restProps}
>
	{@render children()}
</button>