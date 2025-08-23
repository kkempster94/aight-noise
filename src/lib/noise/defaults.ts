import * as Tone from 'tone';
import type { NoiseComplexity } from './types.js';

export const defaultNoiseTypes = [
	{ type: 'white' as Tone.NoiseType, name: 'White Noise', color: '#ffffff', complexity: 'basic' as NoiseComplexity },
	{ type: 'brown' as Tone.NoiseType, name: 'Brown Noise', color: '#8b4513', complexity: 'basic' as NoiseComplexity },
	{ type: 'pink' as Tone.NoiseType, name: 'Pink Noise', color: '#ffc0cb', complexity: 'basic' as NoiseComplexity },
	{ type: 'ocean' as const, name: 'Ocean', color: '#4a90e2', complexity: 'complex' as NoiseComplexity }
];