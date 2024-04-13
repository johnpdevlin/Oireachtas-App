/** @format */

import { dateToYMDstring } from '../../_utils/dates';
import { isDate } from 'date-fns';
import { DateRangeStr } from '@/models/dates';
import { AllMemberBioData } from '@/models/member/_all_bio_data';
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
		webpages,
		education,
		almaMater,
		offices,
	} = member;
	let { committees, birthDate } = member;

	const shavedCommittees = shaveCommitteesData(committees);

	const dailConstits = constituencies.dail! ?? [];
	const seanadConstits = constituencies.seanad! ?? [];
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
	};

	const shavedParties = parties.map((p) =>
		shaveMembershipData(p, [{ key: 'uri', value: p.uri }])
	);

	const shavedOffices = offices?.map((o) =>
		shaveMembershipData(o, [{ key: 'type', value: o.type }])
	);
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
		email,
		...(shavedBirthDate! && { birthDate: shavedBirthDate() }),
		...(birthPlace && { birthPlace }),
		parties: shavedParties,
		constituencies: shavedConstituencies,
		...(committees &&
			(committees.current.length > 0 || committees.past.length > 0) && {
				committees: shavedCommittees,
			}),
		...(offices && offices.length > 0 && { offices: shavedOffices }),
		...(education! &&
			education.length > 0 && { education: education?.map((edu) => edu.name) }),
		...(almaMater! &&
			almaMater.length > 0 && { almaMater: almaMater?.map((am) => am.name) }),
		webpages,
	};
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
