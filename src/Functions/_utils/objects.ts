/** @format */

import { DailYear } from '@/models/dates';

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

export function getUniqueYears<T extends { year: DailYear }>(
	data: T[]
): DailYear[] {
	return data.reduce((years: DailYear[], item: T) => {
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
