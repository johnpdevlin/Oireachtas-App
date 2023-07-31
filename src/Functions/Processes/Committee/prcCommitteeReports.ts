/** @format */

import processCommitteeAttendanceBetweenDates from '@/Functions/GetWebsiteData/Oireachtas/Attendance/Commitee/prcAttendanceBetweenDates';

type CommitteeAttendance = {
	date: Date;
	name: string;
	uri: string;
	type: string;
	chamber: string;
	houseNo: number;
	pdf: string;
	xml: string;
	attendees: string[];
	alsoPresent: string[];
};
export default async function prcCommitteeReports(
	date_start: string,
	date_end?: string
) {
	processCommitteeAttendanceBetweenDates(date_start, date_end);
}
