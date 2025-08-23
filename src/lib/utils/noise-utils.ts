import { OceanNoise, type NoiseSource } from '$lib/noise';

export function startNoiseSource(source: NoiseSource): void {
	if (source.complexity === 'complex') {
		if (source instanceof OceanNoise) {
			source.start();
		}
	} else {
		source.node.start();
		source.isPlaying = true;
	}
}

export function stopNoiseSource(source: NoiseSource): void {
	if (source.complexity === 'complex') {
		if (source instanceof OceanNoise) {
			source.stop();
		}
	} else {
		source.node.stop();
		source.isPlaying = false;
	}
}

export async function recreateBasicNoiseNode(source: NoiseSource): Promise<void> {
	if (source.complexity === 'basic') {
		// Recreate node for next play
		const Tone = await import('tone');
		const newNoise = new Tone.Noise(source.node.type);
		newNoise.connect(source.gain);
		source.node.dispose();
		source.node = newNoise;
	}
}