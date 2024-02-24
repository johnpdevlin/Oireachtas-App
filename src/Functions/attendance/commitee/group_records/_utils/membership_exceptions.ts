/** @format */

import { MemberParty } from '@/models/member';
import { MemberConstituency } from '@/models/oireachtasApi/Formatted/Member/constituency';
import { MembershipType } from '../constits+parties';
import { AttendanceRecord } from '@/models/attendance';
import { initializeAttendanceSummary } from '@/functions/attendance/_utils/init_attendance_summary';

// Deal with cases where membships overlap in same year
function handleMembershipExceptions(
	memberships: (MemberConstituency | MemberParty)[],
	group_type: MembershipType,
	record: AttendanceRecord
) {
	const year = record.year!;
	const relevantMemberships = getRelevantMemberships(memberships, year);

	return relevantMemberships.map((membership) => ({
		uri: membership.uri,
		group_type,
		record: parseRecordsByMembership(group_type, membership, record),
	}));
}

function getRelevantMemberships(
	memberships: MemberConstituency[] | MemberParty[],
	year: number
) {
	return memberships.filter(({ dateRange }) => {
		const startYear = new Date(dateRange.start).getFullYear();
		const endYear = dateRange.end
			? new Date(dateRange.end).getFullYear()
			: year;
		return year >= startYear && year <= endYear;
	});
}

function parseRecordsByMembership(
	membership_type: 'party' | 'constituency',
	membership: MemberConstituency | MemberParty,
	record: AttendanceRecord
) {
	let { start, end } = membership.dateRange;
	const startDate = new Date(start);
	const endDate = end ? new Date(end) : undefined;

	// create summary object
	const summary = initializeAttendanceSummary(
		record.uri,
		record.year!,
		membership_type
	);

	// updates summary with dates relevant to the membership
	function updateSummary(status: 'present' | 'also_present' | 'absent') {
		record[status]
			.flat()
			.filter((rel: Date) => rel >= startDate && (!endDate || rel <= endDate))
			.map((pres: Date) => {
				const month = pres.getMonth();
				summary.present[month].push(pres);
			});
	}
	updateSummary('present');
	updateSummary('absent');
	updateSummary('also_present');
	return summary;
}

export { handleMembershipExceptions };
