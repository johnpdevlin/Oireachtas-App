/** @format */

export function isSmallestNumber(
	number: number,
	numberArray: number[]
): boolean {
	const smallestNumber = Math.min(...numberArray);
	return number === smallestNumber;
}

export function isLargestNumber(
	number: number,
	numberArray: number[]
): boolean {
	const largestNumber = Math.max(...numberArray);
	return number === largestNumber;
}
