/** @format */

import fetchHouses from '@/Functions/API-Calls/OireachtasAPI/houses';
import fetchMembers from '@/Functions/API-Calls/OireachtasAPI/members';
import { Chamber } from '@/Models/_utility';
import {
	OirRecord,
	aggregateMemberOirRecords,
} from './Aggregate/Oireachtas-API/Member/member';
import prcAttendanceReports from '../Attendance/prcAttendanceReport';
import getSittingDates from '../getSittingDates';
import { SittingDaysReport } from '@/Functions/GetWebsiteData/Oireachtas/parseSittingDaysPDF';
import { RawFormattedMember } from '@/Models/OireachtasAPI/member';
import { mergeObjectsByDateProp } from '@/Functions/Util/objects';

export async function prcParticipation(
	chamber: Chamber,
	house_no: number,
	dates?: { start?: string; end?: string }
) {
	console.log(
		`Aggregated Records for ${chamber}${house_no} update started at ${new Date()}`
	);

	const members = await fetchMembers({ chamber, house_no: house_no });

	const house = await fetchHouses({
		house_no: house_no,
		chamber: chamber,
	});

	// Gets dates from house session if not provided
	dates = { start: dates?.start, end: dates?.end };
	if (dates?.start == undefined) dates.start = house[0].dateRange.start;
	if (dates?.end == undefined)
		if (house[0].dateRange.endDate != undefined)
			dates.end = house[0].dateRange.end;

	// Gets aggregated Oireachtas API records
	const aggregatedMemberOirRecords = await aggregateMemberOirRecords(
		[members[0], members[1]],
		dates.start!,
		dates.end!
	);

	// Gets processed attendance from attendance PDF records
	const attendance = await prcAttendanceReports({
		house_no: house_no,
		chamber: chamber,
	});

	// Gets sitting dates from API
	const sittingDates = getSittingDates(dates.start!, dates.end!);

	const exceptions = members // find where members didn't serve full terms
		.map((m: RawFormattedMember) => {
			if (m.dateRange.start != dates!.start || m.dateRange.end != dates!.end) {
				return {
					member: m.uri,
					start: m.dateRange.start,
					end: m.dateRange.end,
				};
			}
		})
		.filter((m: unknown) => m != undefined);

	const merge = prcDailAttendance(
		(await sittingDates).dailSitting,
		aggregatedMemberOirRecords,
		attendance!,
		exceptions
	);
}

export default async function prcDailAttendance(
	sittingDates: string[],
	memberRecords: OirRecord[],
	memberAttendanceReports: SittingDaysReport[],
	exceptions: { member: string; start: string; end: string }[]
) {
	const mergedRecords = [];

	for (let m of memberRecords) {
		let tempSittingDates = sittingDates;

		if (exceptions.find((e) => e.member === m.member)) {
			// If member has exceptions, get sitting dates for exception period
			// IE where member was not in house for full term
			// Reassigns tempSittingDates to be these dates
			const e = exceptions.find((e) => e.member === m.member);
			const temp = await getSittingDates(e!.start, e!.end);
			tempSittingDates = temp.dailSitting;
		}

		const houseVotes = m.houseVotes
			// Filter out votes where member did not vote
			.map((v) => {
				if (v.votesCount > 0) return { ...v };
			})
			.filter((v) => v != undefined);

		// Filter out questions record where no questions
		const oralQuestions = m.questions?.filter((q) => q.oralQuestionCount > 0);

		// Gets all dates where member contributed
		const datesContributed = new Set();
		[
			...houseVotes,
			...m.houseSpeeches,
			...(oralQuestions ? oralQuestions : []),
		].forEach((d: unknown) => {
			datesContributed.add(d.date);
		});

		// Gets all dates where member did not contribute
		const datesNotContributed = tempSittingDates
			.map((d) => {
				if (!datesContributed.has(d)) return d;
			})
			.filter((d) => d != undefined);

		// Gets members attendance report
		const temp = memberAttendanceReports.filter((a) => a.uri === m.member);

		// Gets all dates where member attendance was reported
		const datesAttendanceReported: (string | undefined)[] = [];
		temp.forEach((d) => {
			datesAttendanceReported.push(...d.sittingDates);
		});
		console.log(datesAttendanceReported);
		const houseParticipation = mergeObjectsByDateProp([
			...houseVotes,
			...m.houseSpeeches,
			...m.questions!,
		]).map((hp) => {
			// need to change dar from dd/mm/yyyy to yyyy-mm-dd or something etc.
			if (datesAttendanceReported.includes(hp.date) === true) {
				console.log(hp.date);
				return {
					attendanceRecorded: true,
					...hp,
				};
			}
			return hp;
		});

		console.log(houseParticipation);

		// also need to get all member attendance for full range
		mergedRecords.push({
			datesParticipated: houseParticipation,
			datesNotContributed: datesNotContributed,
		});
	}

	return mergedRecords;
}
