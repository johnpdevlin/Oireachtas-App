/** @format */

import { RawMembership } from '@/Models/OireachtasAPI/member';
import { parseOffices } from './offices';

export default function parseMemberships(membership: RawMembership) {
	if (membership.offices.length! > 0) {
		const offices = parseOffices(membership);
		console.log(offices);
	}
}
