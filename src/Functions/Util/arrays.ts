/** @format */

export function removeDuplicateObjects(arr: {}[]) {
	const seen = new Set();
	return arr.filter((obj) => {
		const serialized = JSON.stringify(obj);
		if (!seen.has(serialized)) {
			seen.add(serialized);
			return true;
		}
		return false;
	});
}

export function removeDuplicates<T>(arr: T[]): T[] {
	return Array.from(new Set(arr));
}

export function isArrayOnlyValues(arr: []) {
	for (let i = 0; i < arr.length; i++) {
		if (typeof arr[i] === 'object' && arr[i] !== null) {
			return false; // Array contains at least one object
		}
	}
	return true; // Array contains only values
}
