import * as Tone from 'tone';
import type { NoiseSource } from './types.js';

export class OceanNoise implements NoiseSource {
	id: string;
	name = 'Ocean';
	color = '#4a90e2';
	complexity = 'complex' as const;
	node: Tone.Noise;
	gain: Tone.Gain;
	volume = 0.5;
	isPlaying = false;
	private lowFilter: Tone.Filter;
	private highFilter: Tone.Filter;
	private reverb: Tone.Reverb;
	private highNoise: Tone.Noise;
	private highGain: Tone.Gain;
	private mixGain: Tone.Gain;
	private volumeLFO: Tone.LFO;
	private filterLFO: Tone.LFO;
	private modulatedGain: Tone.Gain;

	constructor(masterGain: Tone.Gain) {
		this.id = crypto.randomUUID();
		this.gain = new Tone.Gain(0.5);
		this.mixGain = new Tone.Gain(1);
		this.modulatedGain = new Tone.Gain(0.7);

		// Create realistic rain sound by mixing filtered noises
		// Main rain body (low frequencies for the "whoosh")
		this.node = new Tone.Noise('brown');
		this.lowFilter = new Tone.Filter(1200, 'lowpass');

		// High frequency texture (for individual droplet sounds)
		this.highNoise = new Tone.Noise('white');
		this.highFilter = new Tone.Filter(2000, 'highpass');
		this.highGain = new Tone.Gain(0.3);

		// Subtle reverb for space
		this.reverb = new Tone.Reverb(0.8);

		// Add intermittency with LFOs for natural ocean variation
		this.volumeLFO = new Tone.LFO(0.2, 0.4, 1);
		this.filterLFO = new Tone.LFO(0.3, 600, 1200);

		// Connect main rain body
		this.node.connect(this.lowFilter);
		this.lowFilter.connect(this.modulatedGain);

		// Connect high frequency texture
		this.highNoise.connect(this.highFilter);
		this.highFilter.connect(this.highGain);
		this.highGain.connect(this.modulatedGain);

		// Apply modulation for intermittency
		this.volumeLFO.connect(this.modulatedGain.gain);
		this.filterLFO.connect(this.lowFilter.frequency);

		// Add reverb and connect to output
		this.modulatedGain.connect(this.mixGain);
		this.mixGain.connect(this.reverb);
		this.reverb.connect(this.gain);
		this.gain.connect(masterGain);
	}

	async start(): Promise<void> {
		if (this.isPlaying) return;

		if (Tone.getContext().state === 'suspended') {
			await Tone.start();
		}

		this.node.start();
		this.highNoise.start();
		this.volumeLFO.start();
		this.filterLFO.start();
		this.isPlaying = true;
	}

	stop(): void {
		if (!this.isPlaying) return;

		this.node.stop();
		this.highNoise.stop();
		this.volumeLFO.stop();
		this.filterLFO.stop();
		this.isPlaying = false;

		// Recreate the rain setup
		this.node.dispose();
		this.highNoise.dispose();

		this.node = new Tone.Noise('brown');
		this.highNoise = new Tone.Noise('white');

		this.node.connect(this.lowFilter);
		this.highNoise.connect(this.highFilter);
	}

	setVolume(volume: number): void {
		this.volume = volume;
		this.gain.gain.rampTo(volume, 0.1);
	}

	dispose(): void {
		if (this.isPlaying) {
			this.stop();
		}
		this.node.dispose();
		this.highNoise.dispose();
		this.lowFilter.dispose();
		this.highFilter.dispose();
		this.reverb.dispose();
		this.highGain.dispose();
		this.mixGain.dispose();
		this.modulatedGain.dispose();
		this.volumeLFO.dispose();
		this.filterLFO.dispose();
		this.gain.dispose();
	}
}