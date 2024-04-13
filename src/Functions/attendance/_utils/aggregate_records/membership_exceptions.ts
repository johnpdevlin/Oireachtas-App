/** @format */
import { MemberConstituency } from '@/models/oireachtas_api/Formatted/Member/constituency';
import { MembershipType } from './_constits+parties';
import { AttendanceRecord, GroupAttendanceRecord } from '@/models/attendance';
import { initializeAttendanceSummary } from '@/functions/attendance/_utils/init_attendance_summary';
import { RawMemberParty } from '@/models/oireachtas_api/member';

// Deal with cases where membships overlap in same year
function handleMembershipExceptions(
	memberships: MemberConstituency[] | RawMemberParty[],
	group_type: MembershipType,
	record: AttendanceRecord
) {
	const year = record.year!;
	const relevantMemberships: {
		uri: string;
		group_type: MembershipType;
		record: AttendanceRecord;
	}[] = [];

	getRelevantMemberships(memberships, year).forEach(
		(membership: RawMemberParty | MemberConstituency) => {
			const processed = {
				uri: membership.uri,
				group_type,
				record: parseRecordsByMembership(membership, record),
			};
			if (
				processed.record.present.flat().length > 0 ||
				processed.record.absent.flat().length > 0 ||
				processed.record.also_present.flat().length > 0
			)
				relevantMemberships.push(processed);
		}
	);

	return relevantMemberships;
}

function getRelevantMemberships(
	memberships: MemberConstituency[] | RawMemberParty[],
	year: number
) {
	return memberships.filter(({ dateRange }) => {
		const startYear = new Date(dateRange.start).getFullYear();
		const endYear = dateRange.end!
			? new Date(dateRange.end).getFullYear()
			: new Date().getFullYear();
		return year >= startYear && year <= endYear;
	});
}

function parseRecordsByMembership(
	membership: MemberConstituency | RawMemberParty,
	record: AttendanceRecord
) {
	let { start, end } = membership.dateRange;
	const startDate = new Date(start);
	const endDate = end! ? new Date(end) : new Date();

	// create summary object
	const summary = initializeAttendanceSummary(
		record.uri,
		record.year!,
		'member'
	) as AttendanceRecord;

	// updates summary with dates relevant to the membership
	function updateSummary(
		status: 'present' | 'also_present' | 'alsoPresent' | 'absent'
	) {
		// Normalize the status to match the property names in MemberCommitteeAttendance
		const normalizedStatus = status === 'alsoPresent' ? 'also_present' : status;

		record[normalizedStatus]
			.flat()
			.filter((rel: Date) => rel >= startDate && rel <= endDate)
			.map((pres: Date) => {
				const month = pres.getMonth();
				summary[normalizedStatus][month].push(pres);
			});
	}
	updateSummary('present');
	updateSummary('absent');
	updateSummary('also_present');

	return summary;
}

export { handleMembershipExceptions };
