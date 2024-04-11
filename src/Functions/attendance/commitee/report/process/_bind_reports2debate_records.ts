/** @format */

import { RawMember } from '@/models/oireachtasApi/member';
import { CommitteeDebateRecord } from '@/models/oireachtasApi/debate';
import parseCommitteeReport from '../parse/_parse_committee_attendance';
import { CommitteeAttendance } from '@/models/attendance';
import { RawCommittee } from '@/models/oireachtasApi/committee';
import { matchReport2Committee } from './match_report2committee';
import { verifyAttendanceReports } from './final_attendance_verification';

export async function bindReportsToDebateRecords(
	records: CommitteeDebateRecord[],
	committees: RawCommittee[],
	allMembers: RawMember[]
): Promise<CommitteeAttendance[]> {
	const parsedRecords: CommitteeAttendance[] = [];

	console.log(`Binding ${records.length} reports to records...`);

	for (const record of records) {
		if (!record.pdf) {
			console.error('Missing PDF for record: ', record);
			continue;
		}

		const committee = matchReport2Committee(
			record.uri,
			committees,
			record.date
		);

		if (!committee) {
			console.warn('No matching committee found for record: ', record);
			continue;
		}

		try {
			const report = await fetchReportWithRetry(
				record.pdf,
				committee,
				allMembers,
				record.date
			);
			if (!report) {
				console.error('Failed to parse committee report for record: ', record);
				continue;
			}

			parsedRecords.push({
				...record,
				uri: committee.uri,
				present: report.present,
				absent: report.absent,
				also_present: report.alsoPresent,
			});

			if (committee.uri === 'seanad_public_consultation_committee') {
				console.info(
					'Report for Seanad Public Consultation Committee:',
					report
				);
			}

			const count = parsedRecords.length;
			if (count % 100 === 0 && count !== 0) {
				console.info(`${count} bound...`);
			}
		} catch (error) {
			console.error('Error processing record: ', record, error);
		}
	}

	console.log(
		`${parsedRecords.length} reports successfully bound to records. Process completed.`
	);
	return verifyAttendanceReports(parsedRecords, committees);
}

async function fetchReportWithRetry(
	url: string,
	committee: RawCommittee,
	allMembers: RawMember[],
	date: Date,
	maxRetries: number = 5
) {
	let retries = 0;
	while (retries < maxRetries) {
		try {
			return await parseCommitteeReport(url, committee, allMembers, date);
		} catch (error) {
			console.log(
				`Error fetching committee report from URL ${url}, retrying...`
			);
			retries++;
		}
	}
	throw new Error(
		`Failed to fetch committee report from URL ${url} after ${maxRetries} retries`
	);
}
