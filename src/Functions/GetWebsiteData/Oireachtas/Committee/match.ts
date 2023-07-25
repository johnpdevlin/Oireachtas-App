/** @format */

import { RawCommitteeAttendance, Committee } from '@/Models/committee';

export default function matchRecordToCommittee(
	record: RawCommitteeAttendance,
	committees: Committee[]
): string | undefined {
	const matchedCommittees = committees.filter(
		(c) =>
			record.rootName.includes(c.uri) ||
			record.rootURI.includes(c.uri) ||
			c.uri.includes(record.rootURI)
	);

	if (matchedCommittees.length === 1) {
		return matchedCommittees[0].uri;
	} else if (matchedCommittees.length === 0) {
		console.warn(`No committee matches for following record: \n${record}`);
		return undefined;
	} else if (matchedCommittees.length > 1) {
		// Handles expired and successor committee
		// Compares record against endDate
		const date = record.date.getTime();
		const isExpired = matchedCommittees.filter((nm) => {
			nm.endDate && nm.endDate.getTime() > date;
		});
		const isCurrent = matchedCommittees.filter(
			(nm) => nm.endDate === undefined
		);
		if (matchedCommittees.length === 2) {
			if (isExpired.length === 1) return isExpired[0].uri;
			else return isCurrent[0].uri;
		} else {
			console.warn(
				`Multiple committee matches for following record: \n${record} \n Potential committees are: \n${matchedCommittees}`
			);
			return undefined;
		}
	}
}
