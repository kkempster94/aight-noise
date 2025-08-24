import * as Tone from 'tone';
import type { NoiseSource } from './types.js';
import { OceanNoise } from './ocean-noise.js';
import { generateUUID } from '../utils/uuid.js';

export class NoiseManager {
	private sources: Map<string, NoiseSource> = new Map();
	private masterGain: Tone.Gain;
	private isGloballyPlaying = false;

	constructor() {
		this.masterGain = new Tone.Gain(0.7).toDestination();
	}

	createNoiseSource(type: Tone.NoiseType | string, name: string, color: string, complexity: 'basic' | 'complex' = 'basic'): string {
		if (complexity === 'complex') {
			// Handle complex noise types
			if (type === 'ocean') {
				const oceanNoise = new OceanNoise(this.masterGain);
				oceanNoise.setVolume(0.5);
				this.sources.set(oceanNoise.id, oceanNoise);
				return oceanNoise.id;
			}
			// Future complex noise types can be added here
			throw new Error(`Unknown complex noise type: ${type}`);
		}

		const id = generateUUID();
		const noise = new Tone.Noise(type as Tone.NoiseType);
		const gain = new Tone.Gain(0.5);

		noise.connect(gain);
		gain.connect(this.masterGain);

		const source: NoiseSource = {
			id,
			name,
			color,
			complexity,
			node: noise,
			gain,
			volume: 0.5,
			isPlaying: false
		};

		this.sources.set(id, source);
		return id;
	}

	async startNoise(id: string): Promise<void> {
		const source = this.sources.get(id);
		if (!source || source.isPlaying) return;

		if (source.complexity === 'complex') {
			if (source instanceof OceanNoise) {
				await source.start();
			}
		} else {
			if (Tone.getContext().state === 'suspended') {
				await Tone.start();
			}
			source.node.start();
			source.isPlaying = true;
		}
	}

	stopNoise(id: string): void {
		const source = this.sources.get(id);
		if (!source || !source.isPlaying) return;

		if (source.complexity === 'complex') {
			if (source instanceof OceanNoise) {
				source.stop();
			}
		} else {
			source.node.stop();
			source.isPlaying = false;

			// Create new noise node for next play
			const newNoise = new Tone.Noise(source.node.type);
			newNoise.connect(source.gain);
			source.node.dispose();
			source.node = newNoise;
		}
	}

	setVolume(id: string, volume: number): void {
		const source = this.sources.get(id);
		if (!source) return;

		if (source.complexity === 'complex') {
			if (source instanceof OceanNoise) {
				source.setVolume(volume);
			}
		} else {
			source.volume = volume;
			source.gain.gain.rampTo(volume, 0.1);
		}
	}

	async startAllActive(): Promise<void> {
		if (this.isGloballyPlaying) return;

		if (Tone.getContext().state === 'suspended') {
			await Tone.start();
		}

		for (const source of this.sources.values()) {
			if (source.volume > 0) {
				if (source.complexity === 'complex') {
					if (source instanceof OceanNoise) {
						await source.start();
					}
				} else {
					source.node.start();
					source.isPlaying = true;
				}
			}
		}
		this.isGloballyPlaying = true;
	}

	stopAll(): void {
		if (!this.isGloballyPlaying) return;

		for (const source of this.sources.values()) {
			if (source.isPlaying) {
				if (source.complexity === 'complex') {
					if (source instanceof OceanNoise) {
						source.stop();
					}
				} else {
					source.node.stop();
					source.isPlaying = false;

					// Recreate node for next play
					const newNoise = new Tone.Noise(source.node.type);
					newNoise.connect(source.gain);
					source.node.dispose();
					source.node = newNoise;
				}
			}
		}
		this.isGloballyPlaying = false;
	}

	get isPlaying(): boolean {
		return this.isGloballyPlaying;
	}

	setMasterVolume(volume: number): void {
		this.masterGain.gain.rampTo(volume, 0.1);
	}

	getSource(id: string): NoiseSource | undefined {
		return this.sources.get(id);
	}

	getAllSources(): NoiseSource[] {
		return Array.from(this.sources.values());
	}

	removeSource(id: string): void {
		const source = this.sources.get(id);
		if (source) {
			if (source.complexity === 'complex') {
				if (source instanceof OceanNoise) {
					source.dispose();
				}
			} else {
				if (source.isPlaying) {
					source.node.stop();
				}
				source.node.dispose();
				source.gain.dispose();
			}
			this.sources.delete(id);
		}
	}

	dispose(): void {
		this.sources.forEach((source) => {
			if (source.complexity === 'complex') {
				if (source instanceof OceanNoise) {
					source.dispose();
				}
			} else {
				if (source.isPlaying) {
					source.node.stop();
				}
				source.node.dispose();
				source.gain.dispose();
			}
		});
		this.sources.clear();
		this.masterGain.dispose();
	}
}