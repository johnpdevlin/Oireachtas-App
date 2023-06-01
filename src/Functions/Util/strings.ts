/** @format */

export function startsWithNumber(str: string): boolean {
	return /^\d/.test(str);
}

export function removeNumberPrefix(str: string): string {
	// Remove "1. " or "1." etc. from the"
	return str.replace(/^\d+\.\s*/, '');
}
