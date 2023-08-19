/** @format */

import { MemberAPIdetails } from '@/Models/OireachtasAPI/Formatted/Member/member';
import { MemberRequest } from '@/Models/OireachtasAPI/member';
import fetchMembers from '../Raw/get';
import getMemberAPIdetails from './MemberDetails';
import { MemberURI } from '@/Models/_util';

export default async function getMultiMembersAPIdetails(
	uris?: string[],
	request?: MemberRequest
): Promise<MemberAPIdetails[] | void> {
	try {
		if (!uris && request!) {
			try {
				uris = (await fetchMembers(request))?.map((member) => {
					return member.memberCode;
				});
				if (uris!) {
					return Promise.all(
						uris!.map((uri) => {
							return getMemberAPIdetails(uri as MemberURI);
						})
					) as Promise<MemberAPIdetails[]>;
				}
			} catch (err) {
				console.log(err);
			}
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
