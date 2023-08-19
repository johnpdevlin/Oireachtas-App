/** @format */
import { MemberRequest } from '@/Models/OireachtasAPI/member';
import getMemberAPIdetails, { MemberAPIdetails } from './MemberDetails';
import fetchMembers from '../../../Deprecated_Fetch/members';

export default async function getMultiMembersAPIdetails(
	uris?: string[],
	request?: MemberRequest
): Promise<MemberAPIdetails[] | void> {
	try {
		if (!uris && request!) {
			uris = (await fetchMembers(request)).map((member) => member.uri);
			return Promise.all(
				uris.map((uri) => {
					return getMemberAPIdetails(uri);
				})
			) as Promise<MemberAPIdetails[]>;
		} else if (uris!) {
			return Promise.all(
				uris!.map((uri) => {
					return getMemberAPIdetails(uri);
				})
			) as Promise<MemberAPIdetails[]>;
		} else {
			console.error('no uris or request parameters provided.');
		}
	} catch (err) {
		console.log(err);
	}
}
