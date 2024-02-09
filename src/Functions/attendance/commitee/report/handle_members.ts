/** @format */

import { MemberBaseKeys, BinaryChamber } from '@/models/_utils';
import { Committee, CommitteeMember } from '@/models/committee';
import { RawMember } from '@/models/oireachtasApi/member';

function getMembersAndNonMembers(
	committee: Committee,
	allMembers: RawMember[]
): {
	members: MemberBaseKeys[];
	nonMembers: MemberBaseKeys[];
	warnings: string[];
} {
	const warnings: string[] = [];
	let chamber: BinaryChamber = 'dail';
	let members: MemberBaseKeys[] = [];
	let nonMembers: MemberBaseKeys[] = [];

	if (committee.members) {
		const dail = committee.members.dail;
		const seanad = committee.members.seanad;

		members = members.concat(dail || []);
		if (seanad && (chamber === 'dail' || committee.types?.[0] === 'select')) {
			members = members.concat(seanad);
			chamber = 'seanad';
		}
	} else {
		warnings.push('No committee.');
	}

	nonMembers = allMembers
		.filter((am) => members.every((com) => com.uri !== am.uri))
		.map(
			(member) =>
				({
					name: member.fullName,
					uri: member.uri,
					house_code: chamber,
				} as MemberBaseKeys)
		);

	return { members, nonMembers, warnings };
}

// Sorts into current members and non members on given date
function getPastMembers(
	chamber: BinaryChamber,
	committee: Committee
): CommitteeMember[] {
	let pastMembers: CommitteeMember[] = [];
	if (committee.pastMembers) {
		const dail = committee.pastMembers.dail;
		const seanad = committee.pastMembers.seanad;

		pastMembers = pastMembers.concat(dail || []);
		if (seanad && (chamber === 'dail' || committee.types?.[0] === 'select')) {
			pastMembers = pastMembers.concat(seanad);
		}
	}
	return pastMembers;
}

function handlePastMembers(
	pastMembers: CommitteeMember[],
	members: MemberBaseKeys[],
	nonMembers: MemberBaseKeys[],
	date: Date
): { members: MemberBaseKeys[]; nonMembers: MemberBaseKeys[] } {
	pastMembers.forEach((member) => {
		const mDateRange = member.dateRange;
		const memberObj: MemberBaseKeys = {
			uri: member.uri,
			name: member.name,
			house_code: member.house_code,
		};

		if (date.getTime() > new Date(mDateRange.start).getTime()) {
			if (
				new Date(mDateRange.end!).getTime() &&
				date.getTime() < new Date(mDateRange.end!).getTime()
			) {
				members.push(memberObj);
			} else {
				nonMembers.push(memberObj);
			}
		}
	});
	return { members, nonMembers };
}

export { handlePastMembers, getMembersAndNonMembers, getPastMembers };
