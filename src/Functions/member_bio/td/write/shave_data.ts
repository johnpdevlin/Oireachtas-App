/** @format */

import { dateToYMDstring } from '../../../_utils/dates';
import { isDate } from 'date-fns';
import { DateRangeStr } from '@/models/dates';
import { AllMemberBioData } from '@/models/member/_all_bio_data';
import { WikiPosition } from '../../../../models/member/wiki_profile';
import {
	MemberPageBioData,
	MemberPageMembership,
} from '@/models/pages/member/member';

export default function shaveUnneccessaryBioData(
	member: AllMemberBioData
): MemberPageBioData {
	const {
		uri,
		fullName,
		gender,
		contactNumbers,
		email,
		address,
		birthPlace,
		parties,
		constituencies,
		partyPositions,
		otherPositions,
		webpages,
		education,
		almaMater,
		offices,
	} = member;
	let { committees, birthDate } = member;

	const shavedCommittees = shaveCommitteesData(committees);

	const dailConstits = constituencies.dail! ?? [];
	const seanadConstits = constituencies.seanad! ?? [];
	const otherConstits = constituencies.other! ?? [];
	const shavedConstituencies = {
		...(dailConstits.length > 0 && {
			dail: dailConstits.map((dc) =>
				shaveMembershipData(dc, [{ key: 'uri', value: dc.uri }])
			),
		}),
		...(seanadConstits.length > 0 && {
			seanad: seanadConstits.map((sc) =>
				shaveMembershipData(sc, [{ key: 'uri', value: sc.uri }])
			),
		}),
		...(otherConstits.length > 0 && {
			other: otherConstits.map((sc) => {
				return {
					name: sc.title.name,
					dateRange: {
						start: dateToYMDstring(sc.dateRange.start),
						end: dateToYMDstring(sc.dateRange.end!) ?? undefined,
					},
				};
			}) as MemberPageMembership[],
		}),
	};

	const shavedParties = parties.map((p) =>
		shaveMembershipData(p, [{ key: 'uri', value: p.uri }])
	) as MemberPageMembership[];

	const shavedOffices = offices?.map((o) =>
		shaveMembershipData(o, [{ key: 'type', value: o.type }])
	) as MemberPageMembership[];
	const shavedPartyPositions = partyPositions?.map((pp) =>
		shaveWikiPositionData(pp)
	) as MemberPageMembership[];
	const shavedOtherPositions = otherPositions?.map((op) =>
		shaveWikiPositionData(op)
	) as MemberPageMembership[];
	const shavedBirthDate = () => {
		const formattedBirthDate = isDate(birthDate)
			? (birthDate as Date)
			: new Date(birthDate?.toDateString() as string);

		const dateStr = isDate(formattedBirthDate)
			? dateToYMDstring(formattedBirthDate)
			: undefined;
		return dateStr! && !dateStr.includes('NaN') ? dateStr : undefined;
	};

	return {
		uri,
		fullName,
		address,
		gender,
		contactNumbers,
		email: email,
		...(shavedBirthDate! && { birthDate: shavedBirthDate() }),
		...(birthPlace && { birthPlace }),
		constituencies: shavedConstituencies,
		...(committees &&
			(committees.current.length > 0 || committees.past.length > 0) && {
				committees: shavedCommittees,
			}),
		parties: shavedParties,
		...(offices && offices.length > 0 && { offices: shavedOffices }),
		...(shavedPartyPositions &&
			shavedPartyPositions.length > 0 && {
				partyPositions: shavedPartyPositions,
			}),
		...(shavedOtherPositions &&
			shavedOtherPositions.length > 0 && {
				otherPositions: shavedOtherPositions,
			}),
		...(education! &&
			education.length > 0 && { education: education?.map((edu) => edu.name) }),
		...(almaMater! &&
			almaMater.length > 0 && { almaMater: almaMater?.map((am) => am.name) }),
		webpages: webpages,
	} as MemberPageBioData;
}

function shaveCommitteesData<
	T extends { name: string; dateRange: DateRangeStr }
>(committees: { current: T[]; past: T[] }) {
	return {
		...(committees.current! &&
			committees.current.length > 0 && {
				current: committees.current.map((com) => shaveMembershipData(com)),
			}),
		...(committees.past! &&
			committees.past.length > 0 && {
				past: committees.past.map((com) => shaveMembershipData(com)),
			}),
	};
}

function shaveWikiPositionData(
	mem: WikiPosition,
	additional?: { key: string; value: string }[]
): MemberPageMembership {
	const output: MemberPageMembership = {
		name: mem.title.name,
		dateRange: {
			start: dateToYMDstring(mem.dateRange.start),
			end: mem.dateRange.end! ? dateToYMDstring(mem.dateRange.end!) : undefined,
		},
	};

	additional &&
		additional.forEach((ad) => {
			output[ad.key] = ad.value;
		});

	return output;
}

function shaveMembershipData<
	T extends { name: string; dateRange: DateRangeStr }
>(mem: T, additional?: { key: string; value: string }[]): MemberPageMembership {
	const dateRange = {
		start: dateToYMDstring(new Date(mem.dateRange.start)),
		end: mem.dateRange.end!
			? dateToYMDstring(new Date(mem.dateRange.end))
			: undefined,
	};
	const output: MemberPageMembership = {
		name: mem.name,
		dateRange: dateRange,
	};

	additional &&
		additional.forEach((ad) => {
			output[ad.key] = ad.value;
		});

	return output;
}
