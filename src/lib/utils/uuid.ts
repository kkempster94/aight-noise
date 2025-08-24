/**
 * Cross-browser UUID generation with fallbacks for restricted environments like Brave
 */
export function generateUUID(): string {
	// Try native crypto.randomUUID first
	if (typeof crypto !== 'undefined' && crypto.randomUUID) {
		try {
			return crypto.randomUUID();
		} catch (e) {
			// Fallback if crypto.randomUUID is blocked (Brave, etc.)
		}
	}

	// Use crypto.getRandomValues if available
	if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
		try {
			const bytes = new Uint8Array(16);
			crypto.getRandomValues(bytes);
			
			// Set version (4) and variant bits according to RFC 4122
			bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
			bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant bits

			// Convert to hex string with proper formatting
			const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
			
			return [
				hex.substring(0, 8),
				hex.substring(8, 12), 
				hex.substring(12, 16),
				hex.substring(16, 20),
				hex.substring(20, 32)
			].join('-');
		} catch (e) {
			// Fallback if crypto.getRandomValues is also blocked
		}
	}

	// Final fallback using Math.random (less secure but compatible)
	// Based on the popular uuid library implementation
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = Math.random() * 16 | 0;
		const v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}