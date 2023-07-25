/** @format */

export function removeDuplicateObjects<T>(arr: T[]): T[] {
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

export function isArrayOnlyValues(arr: []) {
	for (let i = 0; i < arr.length; i++) {
		if (typeof arr[i] === 'object' && arr[i] !== null) {
			return false; // Array contains at least one object
		}
	}
	return true; // Array contains only values
}

export function getObjectFromArrayOfObjects<T extends { uri: string }>(
	arr: T[]
): Record<string, T> {
	return arr.reduce((result, item) => {
		result[item.uri as string] = item;
		return result;
	}, {} as Record<string, T>);
}
