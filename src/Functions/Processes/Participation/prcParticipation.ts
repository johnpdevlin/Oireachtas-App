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
import { mergeMemberAttendanceRecords } from '@/Functions/GetWebsiteData/Oireachtas/mergeMemberAttRecords';
import { SittingDaysReport } from '@/Functions/GetWebsiteData/Oireachtas/parseSittingDaysPDF';
import { convertDMYdate2YMDstring } from '@/Functions/Util/dates';
import { RawFormattedMember } from '@/Models/OireachtasAPI/member';

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

	const aggregatedMemberOirRecords = await aggregateMemberOirRecords(
		[members[0], members[1]],
		dates.start!,
		dates.end!
	);

	const attendance = await prcAttendanceReports({
		house_no: house_no,
		chamber: chamber,
	});

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
	memberAttendance: SittingDaysReport[],
	exceptions: { member: string; start: string; end: string }[]
) {
	const mergedMemberAttendance = mergeMemberAttendanceRecords(memberAttendance);
	const mergedRecords: OirRecord[] = [];

	for (let m of memberRecords) {
		let tempSittingDates = sittingDates;
		if (exceptions.find((e) => e.member === m.member)) {
			// If member has exceptions, get sitting dates for exception period
			// IE where member was not in house for full term
			const e = exceptions.find((e) => e.member === m.member);
			const temp = await getSittingDates(e!.start, e!.end);
			tempSittingDates = temp.dailSitting;
		}
		const memberAttendance = mergedMemberAttendance.filter(
			(a) => a.uri == m.member
		);

		const houseVotes = m.houseVotes
			.map((v) => {
				if (v.votesCount > 0) return { date: v.date };
			})
			.filter((v) => v != undefined);

		const datesContributed = new Set();
		[
			...houseVotes,
			...m.houseSpeeches,
			...m.houseVotes,
			...(m.questions.oralQuestions?.map((q) => q) ?? []),
		].forEach((d: unknown) => {
			datesContributed.add(d.date);
		});

		const datesNotContributed = tempSittingDates
			.map((d) => {
				if (!datesContributed.has(d)) return d;
			})
			.filter((d) => d != undefined);

		console.log(datesNotContributed);
		// if (memberAttendance != undefined) {
		// 	console.log(datesContributed);
		// }
	}

	return mergedRecords;
}
