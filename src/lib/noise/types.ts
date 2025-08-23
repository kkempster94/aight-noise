import * as Tone from 'tone';

export type NoiseComplexity = 'basic' | 'complex';

export interface NoiseSource {
	id: string;
	name: string;
	color: string;
	complexity: NoiseComplexity;
	node: Tone.Noise;
	gain: Tone.Gain;
	volume: number;
	isPlaying: boolean;
}