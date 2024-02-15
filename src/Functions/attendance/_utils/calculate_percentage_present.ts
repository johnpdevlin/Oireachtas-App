/** @format */

// Type guard to check if the input is a multidimensional array (Date[][]).
function isMultiDimensionalDateArray(
	input: Date[][] | Date[]
): input is Date[][] {
	return Array.isArray(input[0]);
}

function calculatePercentagePresent(
	present: Date[][] | Date[],
	absent: Date[][] | Date[]
): number {
	// Flatten if it's a multidimensional array, otherwise use as-is.
	const flatPresent = isMultiDimensionalDateArray(present)
		? present.flat()
		: present;
	const flatAbsent = isMultiDimensionalDateArray(absent)
		? absent.flat()
		: absent;

	const totalPresentDays = flatPresent.length;
	const totalAbsentDays = flatAbsent.length;
	const totalMeetingDays = totalPresentDays + totalAbsentDays;

	// Ensure we're not dividing by zero.
	return totalMeetingDays > 0 ? (totalPresentDays / totalMeetingDays) * 100 : 0;
}

export { calculatePercentagePresent };
