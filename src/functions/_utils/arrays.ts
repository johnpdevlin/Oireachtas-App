/** @format */

// Removes duplicate objects from an array.
// Uses JSON.stringify for object comparison, which may not be efficient for large or complex objects.
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

// Checks if an array contains only primitive values (non-objects).
// Uses Array.prototype.every for better performance and readability.
export function isArrayOnlyValues(arr: []) {
	return arr.every((item) => !(typeof item === 'object' && item !== null));
}

// Transforms an array of objects into a record object, using 'uri' as the key.
// Assumes that 'uri' is unique in each object.
export function getObjectFromArrayOfObjects<T extends { uri: string }>(
	arr: T[]
): Record<string, T> {
	return arr.reduce((result, item) => {
		result[item.uri as string] = item;
		return result;
	}, {} as Record<string, T>);
}
