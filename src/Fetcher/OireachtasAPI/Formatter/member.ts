/** @format */

import { memberRequest } from '../../../Models/apiRequests';
import fetchMember from '../members';
import { member, membership, membershipType } from '../../../Models/UI/member';
import processMemberships from './Memberships/memberships';

import findOldestDate from '../../../Components/Tools/Time/oldestDate';

export default function formatMember(m: any): member {
	const memberships = processMemberships(m.memberships);

	const { offices, parties, constituencies, seanads, dails } = memberships;

	const setIsCurrent = () => {
		if (constituencies.current.length > 0) {
			return true;
		}
		return false;
	};

	const setCessation = (): Date | undefined => {
		let cease: Date = new Date();
		if (isCurrent == false) {
			const d: Date[] = constituencies.past.map((c) => {
				return c.endDate!;
			});
			if (d.length > 1) {
				cease = findOldestDate(d);
			} else {
				cease = d[0];
			}
		} else if (isCurrent! == true) {
			return;
		}

		return cease;
	};

	const setFirstDailElected = (): Date | undefined => {
		let fde: Date = new Date();
		if (constituencies.past.length > 1) {
			fde = findOldestDate(
				constituencies.past
					.filter((c) => c.type == 'constituency')
					.map((c) => c.startDate)
			);
		} else if (constituencies.past.length == 1) {
			fde = constituencies.past[0].startDate;
		} else if (constituencies.current.length > 0) {
			if (constituencies.current[0].type == 'constituency') {
				fde = constituencies.current[0].startDate;
			} else {
				return;
			}
		} else {
			return;
		}
		return fde;
	};

	const setFirstSeanadElected = (): Date | undefined => {
		let fse: Date = new Date();
		if (constituencies.past.length! > 0) {
			if (constituencies.past.some((s) => s.type == 'panel')) {
				fse = findOldestDate(
					constituencies.past
						.filter((c) => c.type == 'panel')
						.map((c) => c.startDate)
				);
			}
		} else if (constituencies.current.length! > 0) {
			if (constituencies.current[0].type == 'panel') {
				return (fse = constituencies.current[0].startDate);
			} else {
				return;
			}
		} else {
			return;
		}
		return fse;
	};

	const setFirstElected = (): Date => {
		let dail = firstDailElected;
		let seanad = firstSeanadElected;
		let elected: Date | undefined = new Date();
		if (dail! < seanad!) {
			elected = dail;
		} else if (dail! > seanad!) {
			elected = seanad;
		} else if (seanad!) {
			elected = seanad;
		} else {
			elected = dail;
		}
		return elected!;
	};

	let isCurrent: boolean = setIsCurrent();
	let firstDailElected: Date | undefined = setFirstDailElected();
	let firstSeanadElected: Date | undefined = setFirstSeanadElected();
	let firstElected: Date = setFirstElected();
	let cessation: Date | undefined = setCessation();
	// const memberType = (): String | undefined => {
	// 	if (constituencies.current[0].type == 'constituency') {
	// 		return 'td';
	// 	} else if (constituencies.current[0].type == 'panel') {
	// 		return 'senator';
	// 	}
	// 	return undefined;
	// };

	// const pastMemberType = (memberType: string): string[] | undefined => {
	// 	const past: string[] = [];
	// 	if (memberType != 'constituency' || 'panel') {
	// 		for (let c of constituencies.past) {
	// 			if (c.type == 'constituency' && !past.includes('td')) {
	// 				past.push('td');
	// 			} else if (c.type == 'constituency' && !past.includes('senator')) {
	// 				past.push('senator');
	// 			}
	// 		}
	// 	} else if (constituencies.current[0].type == 'constituency') {
	// 		for (let c of constituencies.past) {
	// 			if (c.type == 'seanad' && !past.includes('senator')) {
	// 				past.push('senator');
	// 			}
	// 		}
	// 	} else if (constituencies.current[0].type == 'panel') {
	// 		for (let c of constituencies.past) {
	// 			if (c.house == 'constituency' && !past.includes('td')) {
	// 				past.push('td');
	// 			}
	// 		}
	// 	} else {
	// 		return undefined;
	// 	}
	// 	return past;
	// };

	setIsCurrent();
	setFirstDailElected();
	setFirstSeanadElected();
	setFirstElected();

	const member: member = {
		uri: m.memberCode,
		firstName: m.firstName,
		lastName: m.lastName,
		fullName: m.fullName,
		dateOfDeath: m.dateOfDeath!,
		// memberships
		offices: offices.current!,
		pastOffices: offices.past!,
		constituency: constituencies.current[0]!,
		pastConstituencies: constituencies.past!,
		party: parties.current[0]!,
		pastParties: parties.past!,
		// memberType: undefined,
		// pastMemberType: undefined,
		seanads: seanads!,
		dails: dails!,
		isCurrent: isCurrent!,
		firstElected: firstElected!,
		firstDailElected: firstDailElected!,
		firstSeanadElected: firstSeanadElected!,
		cessation: cessation!,
		oireachtasUrl: `https://www.oireachtas.ie/en/members/member/${m.memberCode}`,
	};

	return member;
}
