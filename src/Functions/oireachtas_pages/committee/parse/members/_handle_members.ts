/** @format */
import { MemberBaseKeys } from '@/models/_utils';
import { CommitteeMember, CommitteeMembers } from '@/models/committee';
import { RawMember } from '@/models/oireachtasApi/member';
import { getMembers } from '@/functions/oireachtas_pages/committee/parse/members/members';
import getChair from '@/functions/oireachtas_pages/committee/parse/members/chair';
import fetchMembers from '../../../../APIs/Oireachtas/member/raw/_member_details';
import { getPastMembers, removePastMembers } from './past_members';
import * as cheerio from 'cheerio';
import { DateRangeObj } from '@/models/dates';

async function handleMembers(
	$: cheerio.CheerioAPI,
	dateRange: DateRangeObj,
	rawMembers?: RawMember[],
	excpDate?: Date
): Promise<{
	members: CommitteeMembers;
	pastMembers: CommitteeMembers;
	chair: MemberBaseKeys;
}> {
	// Fetch members from Oireachtas API
	const allMembers = rawMembers
		? rawMembers
		: ((await fetchMembers({ formatted: false })) as RawMember[]); // For parsing purposes

	// Cross reference against web page data to find committee members
	const members = getMembers(
		$,
		allMembers,
		excpDate! ? excpDate : undefined
	) as CommitteeMembers;
	if (members.dail!)
		members.dail = members.dail.map((member) => {
			return { ...member, dateRange } as CommitteeMember;
		});
	if (members.seanad!)
		members.seanad = members.seanad.map((member) => {
			return { ...member, dateRange } as CommitteeMember;
		});

	const chair = getChair(
		$,
		allMembers,
		excpDate ? excpDate : undefined
	) as MemberBaseKeys;

	const pastMembers = getPastMembers($, allMembers, dateRange);

	// Remove past members from the array of current members
	let filteredMembers = removePastMembers(members, pastMembers);

	return {
		members: filteredMembers,
		pastMembers: pastMembers,
		chair: chair,
	};
}

export { handleMembers };
