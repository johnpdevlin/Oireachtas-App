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
