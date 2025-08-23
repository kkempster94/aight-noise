<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { NoiseManager, defaultNoiseTypes, type NoiseSource, OceanNoise } from '$lib/noise';
	import { IconButton, Container, Card, VolumeSlider, VolumeCard, TutorialPopover } from '$lib';
	import { Play, Pause, Volume2, Plus, X } from 'lucide-svelte';
	import * as Tone from 'tone';
	import { browser } from '$app/environment';
	import { startNoiseSource, stopNoiseSource, recreateBasicNoiseNode } from '$lib/utils/noise-utils';

	let noiseManager: NoiseManager;
	let availableSounds = defaultNoiseTypes;
	let selectedSounds: NoiseSource[] = [];
	let masterVolume = 0.7;
	let isInitialized = false;
	let isPlaying = false;
	let searchFilter = '';
	let playButtonRef: HTMLElement;

	$: filteredSounds = availableSounds.filter((sound) =>
		sound.name.toLowerCase().includes(searchFilter.toLowerCase())
	);

	onMount(() => {
		// Load preferences from localStorage
		if (browser) {
			const savedVolume = localStorage.getItem('aight-noise-volume');
			if (savedVolume) masterVolume = parseFloat(savedVolume);
		}

		noiseManager = new NoiseManager();
		noiseManager.setMasterVolume(masterVolume);

		// Load selected sounds from localStorage or default
		if (browser && localStorage.getItem('aight-noise-selected')) {
			const savedSounds = JSON.parse(localStorage.getItem('aight-noise-selected') || '[]');
			savedSounds.forEach(
				(soundData: { type: string; name: string; color: string; complexity?: 'basic' | 'complex'; volume: number }) => {
					const complexity = soundData.complexity || getComplexityFromName(soundData.name);
					noiseManager.createNoiseSource(soundData.type, soundData.name, soundData.color, complexity);
					const source = noiseManager.getSource(
						Array.from(noiseManager.getAllSources()).find((s) => s.name === soundData.name)?.id ||
							''
					);
					if (source) {
						source.volume = soundData.volume;
						noiseManager.setVolume(source.id, soundData.volume);
					}
				}
			);
		}

		selectedSounds = noiseManager.getAllSources();
		isInitialized = true;
	});

	onDestroy(() => {
		if (noiseManager) {
			noiseManager.dispose();
		}
	});

	function handleKeydown(event: KeyboardEvent) {
		if (event.code === 'Space' && !event.ctrlKey && !event.metaKey && !event.altKey) {
			// Prevent default spacebar behavior (scrolling)
			event.preventDefault();
			// Don't trigger if user is typing in an input
			if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
				return;
			}
			toggleMasterPlay();
		}
	}


	function addSound(soundType: (typeof availableSounds)[0]) {
		noiseManager.createNoiseSource(soundType.type, soundType.name, soundType.color, soundType.complexity);
		selectedSounds = noiseManager.getAllSources();
		saveSelectedSounds();
	}

	function removeSound(soundId: string) {
		noiseManager.removeSource(soundId);
		selectedSounds = noiseManager.getAllSources();
		saveSelectedSounds();
	}

	async function toggleMasterPlay() {
		if (isPlaying) {
			noiseManager.stopAll();
		} else {
			await noiseManager.startAllActive();
		}
		isPlaying = noiseManager.isPlaying;
	}

	function updateVolume(source: NoiseSource, volume: number) {
		noiseManager.setVolume(source.id, volume);
		
		// Update the local array to trigger reactivity
		selectedSounds = selectedSounds.map(s => 
			s.id === source.id ? { ...s, volume } : s
		);

		// If we're playing and this source now has volume, start it
		if (isPlaying && volume > 0 && !source.isPlaying) {
			startNoiseSource(source);
		}
		// If volume is 0 and it's playing, stop it
		else if (volume === 0 && source.isPlaying) {
			stopNoiseSource(source);
			recreateBasicNoiseNode(source);
		}
		
		// Refresh the selected sounds from the manager to get updated state
		selectedSounds = noiseManager.getAllSources();
		saveSelectedSounds();
	}

	function updateMasterVolume(volume: number) {
		masterVolume = volume;
		noiseManager.setMasterVolume(volume);
		if (browser) {
			localStorage.setItem('aight-noise-volume', volume.toString());
		}
	}

	function getTypeFromName(name: string): string {
		const sound = availableSounds.find(s => s.name === name);
		return sound ? sound.type : 'white';
	}

	function getComplexityFromName(name: string): 'basic' | 'complex' {
		const sound = availableSounds.find(s => s.name === name);
		return sound ? sound.complexity : 'basic';
	}

	function saveSelectedSounds() {
		if (browser) {
			const soundsData = selectedSounds.map((s) => ({
				type: getTypeFromName(s.name),
				name: s.name,
				color: s.color,
				complexity: s.complexity,
				volume: s.volume
			}));
			localStorage.setItem('aight-noise-selected', JSON.stringify(soundsData));
		}
	}
</script>

<svelte:head>
	<title>Aight Noise - Minimalist Noise Mixer</title>
	<meta name="description" content="A minimalist noise mixer for ambient soundscapes" />
</svelte:head>

<main class="min-h-screen bg-stone-900 p-6" onkeydown={handleKeydown} tabindex="-1">
	<div class="max-w-5xl mx-auto">
		<header class="flex items-center justify-between mb-8">
			<div>
				<h1 class="text-3xl font-light text-stone-100 mb-2">Aight Noise</h1>
				<p class="text-stone-300">Mix your perfect ambient soundscape</p>
			</div>
			<div class="flex items-center gap-4">
				<!-- Master Controls -->
				<div class="flex items-center gap-3 relative">
					<div class="relative">
						<div bind:this={playButtonRef}>
							<IconButton
								variant={isPlaying ? 'secondary' : 'primary'}
								onclick={toggleMasterPlay}
								aria-label={isPlaying ? 'Pause' : 'Play'}
								title={isPlaying ? 'Pause' : 'Play'}
							>
								{#if isPlaying}
									<Pause size={20} />
								{:else}
									<Play size={20} />
								{/if}
							</IconButton>
						</div>
					</div>

					{#if playButtonRef}
						<TutorialPopover 
							text="Click here or press [spacebar] to play"
							targetElement={playButtonRef}
							placement="bottom-start"
							storageKey="play-button-tutorial"
						/>
					{/if}

					<div class="flex items-center gap-2">
						<Volume2 size={16} class="text-stone-300" />
						<VolumeSlider
							siz
							bind:value={masterVolume}
							orientation="horizontal"
							oninput={(e) => updateMasterVolume(parseFloat(e.currentTarget.value))}
							title="Master Volume: {Math.round(masterVolume * 100)}%"
						/>
						<span class="text-xs font-medium text-stone-200 min-w-[2rem]">
							{Math.round(masterVolume * 100)}%
						</span>
					</div>
				</div>
			</div>
		</header>

		{#if isInitialized}
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<!-- Sound Marketplace -->
				<div>
					<Container 
						title="Sound Library" 
						showSearch={true} 
						searchPlaceholder="Search sounds..."
						bind:searchValue={searchFilter}
					>
						<div class="space-y-2 max-h-64 overflow-y-auto">
							{#each filteredSounds as sound (sound.name)}
								{@const isActive = selectedSounds.some(s => s.name === sound.name)}
								{@const activeSound = selectedSounds.find(s => s.name === sound.name)}
								<Card
									size="compact"
									color={sound.color}
									title={sound.name}
								>
									{#snippet actions()}
										{#if isActive}
											<IconButton
												size="small"
												variant="secondary"
												contrast={true}
												onclick={() => removeSound(activeSound?.id || '')}
												title="Remove {sound.name}"
												class="text-red-400 hover:bg-red-900"
											>
												<X size={16} />
											</IconButton>
										{:else}
											<IconButton
												size="small"
												variant="primary"
												contrast={true}
												onclick={() => addSound(sound)}
												title="Add {sound.name}"
											>
												<Plus size={16} />
											</IconButton>
										{/if}
									{/snippet}
								</Card>
							{/each}
						</div>
					</Container>
				</div>

				<!-- Active Sounds -->
				<div>
					<Container title="Active Sounds">
						{#if selectedSounds.length === 0}
							<p
								class="text-sm text-stone-400 text-center py-8 bg-stone-800 rounded-lg border border-stone-600"
							>
								Add sounds from the library to start mixing
							</p>
						{:else}
							<div class="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
								{#each selectedSounds as source (source.id)}
									<VolumeCard
										width="narrow"
										title={source.name}
										color={source.color}
										bind:volume={source.volume}
										isPlaying={source.isPlaying}
										onVolumeChange={(newVolume) => updateVolume(source, newVolume)}
									/>
								{/each}
							</div>
						{/if}
					</Container>
				</div>
			</div>
		{:else}
			<div class="text-center py-12">
				<div class="animate-pulse text-stone-400">Loading...</div>
			</div>
		{/if}
	</div>

	<footer class="text-center text-sm text-stone-400 mt-12">
		created with love by Kylan
	</footer>
</main>
