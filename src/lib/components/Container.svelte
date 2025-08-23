<script lang="ts">
	let {
		title,
		showSearch = false,
		searchValue = $bindable(''),
		searchPlaceholder = 'Search...',
		children,
		class: className = '',
		...restProps
	}: {
		title: string;
		showSearch?: boolean;
		searchValue?: string;
		searchPlaceholder?: string;
		children: any;
		class?: string;
	} = $props();
</script>

<div
	class="bg-stone-800 rounded-lg p-5 shadow-sm border border-stone-600 hover:shadow-md transition-all duration-200 {className}"
	{...restProps}
>
	<header class="mb-4">
		<h2 class="text-lg font-medium text-stone-100">
			{title}
		</h2>
		
		{#if showSearch}
			<div class="mt-4">
				<input
					type="text"
					placeholder={searchPlaceholder}
					bind:value={searchValue}
					class="w-full px-3 py-2 text-sm border border-stone-600 rounded-md bg-stone-700 text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all duration-200"
				/>
			</div>
		{/if}
	</header>

	<div class="container-content">
		{@render children()}
	</div>
</div>