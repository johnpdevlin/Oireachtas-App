/** @format */
type AnyObject = Record<string, any>;

export function removeOuterObjects(obj: AnyObject): AnyObject {
	if (typeof obj === 'object' && obj !== null) {
		if (
			Object.keys(obj).length === 1 &&
			typeof obj[Object.keys(obj)[0]] === 'object'
		) {
			return removeOuterObjects(obj[Object.keys(obj)[0]]);
		} else {
			const result: AnyObject = {};
			for (const key in obj) {
				result[key] = removeOuterObjects(obj[key]);
			}
			return result;
		}
	} else {
		return obj;
	}
}

export function mergeObjectsByDateProp(data: any[]): any[] {
	const mergedObjects: any[] = [];

	data.forEach((obj) => {
		if (obj.date!) {
			const existingObj = mergedObjects.find(
				(mergedObj) => mergedObj.date === obj.date
			);

			if (existingObj) {
				Object.keys(obj).forEach((key) => {
					if (!existingObj.hasOwnProperty(key)) {
						existingObj[key] = obj[key];
					}
				});
			} else {
				mergedObjects.push({ ...obj });
			}
		}
	});

	return mergedObjects;
}

export function getUniqueYears<T extends { year: number }>(
	data: T[]
): number[] {
	return data.reduce((years: number[], item: T) => {
		if (!years.includes(item.year)) {
			years.push(item.year);
		}
		return years;
	}, []);
}

export function groupObjectsByProperty<T>(arr: T[], property: keyof T): T[][] {
	const groups = new Map<T[keyof T], T[]>();

	arr.forEach((obj) => {
		const value = obj[property];
		if (groups.has(value)) {
			groups.get(value)!.push(obj);
		} else {
			groups.set(value, [obj]);
		}
	});

	return Array.from(groups.values());
}

export function groupByKey<T, K extends keyof unknown>(
	array: T[],
	getKey: (item: T) => K
): Record<K, T[]> {
	return array.reduce((accumulator, item) => {
		const key = getKey(item);
		if (!accumulator[key]) accumulator[key] = [];
		accumulator[key].push(item);
		return accumulator;
	}, {} as Record<K, T[]>);
}

type GroupResult<T> = {
	[key: string]: GroupResult<T> | T[];
};

export function groupByNested<T>(
	array: T[],
	getKeys: (item: T) => string[]
): GroupResult<T> {
	return array.reduce<GroupResult<T>>((accumulator, item) => {
		const keys = getKeys(item);
		keys.reduce((acc, key, index) => {
			// Check if it's the last key and handle accordingly
			if (index === keys.length - 1) {
				if (!acc[key]) acc[key] = [];
				// TypeScript knows acc[key] is an array of T here, thanks to the type assertion
				(acc[key] as T[]).push(item);
			} else {
				if (!acc[key]) acc[key] = {};
				// No assertion needed here, as acc[key] is used as an accumulator again
			}
			return acc[key] as GroupResult<T>;
		}, accumulator);
		return accumulator;
	}, {});
}

export function excludeProperties<T extends object, K extends keyof T>(
	obj: T,
	propsToExclude: K[]
): Omit<T, K> {
	const newObj = { ...obj };
	propsToExclude.forEach((prop) => {
		delete newObj[prop];
	});
	return newObj as Omit<T, K>;
}
