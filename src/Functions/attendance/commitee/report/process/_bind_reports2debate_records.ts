/** @format */

import { RawMember } from '@/models/oireachtasApi/member';
import { CommitteeDebateRecord } from '@/models/oireachtasApi/debate';
import similarity from 'string-similarity';
import parseCommitteeReport from '../parse/_parse_committee_attendance';
import { CommitteeAttendance } from '@/models/attendance';
import { RawCommittee } from '@/models/oireachtasApi/committee';

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

		const possibleURIs = getPossibleURIsAndHouseNo(
			record.uri,
			committees,
			record.date
		);
		const committee = findMatchingCommitteeURI(
			record.uri,
			possibleURIs,
			committees
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
				present: report.present,
				absent: report.absent,
				alsoPresent: report.alsoPresent,
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
	return parsedRecords;
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

function getPossibleURIsAndHouseNo(
	uri: string,
	committees: RawCommittee[],
	date: Date
) {
	const houseNo = uri.split('/').at(-2);
	const possibleURIs: string[] = [];
	const currentTime = date.getTime();
	for (const committee of committees) {
		const {
			committeeDateRange,
			uri: committeeURI,
			altCommitteeURIs,
		} = committee;
		const { start, end } = committeeDateRange;
		const committeeStartTime = new Date(start).getTime();
		const committeeEndTime = end ? new Date(end).getTime() : Infinity;
		if (
			(!houseNo || committeeURI.includes(houseNo)) &&
			currentTime > committeeStartTime &&
			currentTime <= committeeEndTime
		) {
			possibleURIs.push(committeeURI);
			if (altCommitteeURIs) possibleURIs.push(...altCommitteeURIs);
		}
	}
	return possibleURIs;
}

function findMatchingCommitteeURI(
	uri: string,
	possibleURIs: string[],
	committees: RawCommittee[]
): RawCommittee | undefined {
	const matchingCommittee = committees.find(
		(committee) =>
			committee.uri === uri ||
			(committee.altCommitteeURIs && committee.altCommitteeURIs.includes(uri))
	);
	if (matchingCommittee) return matchingCommittee;

	const bestMatch = similarity.findBestMatch(uri, possibleURIs).bestMatch
		.target;
	if (bestMatch) {
		return committees.find(
			(committee) =>
				committee.uri === bestMatch ||
				(committee.altCommitteeURIs &&
					committee.altCommitteeURIs.includes(bestMatch))
		);
	}

	console.warn('No matching committee found for URI: ', uri);
}
