/** @format */

import { MemberAPIdetails } from '@/models/oireachtasApi/Formatted/Member/member';
import { MemberRequest } from '@/models/oireachtasApi/member';
import fetchMembers from '../raw_/get';
import getMemberAPIdetails from './member_details_';
import { MemberURI } from '@/models/_utils';

export default async function getMultiMembersAPIdetails(
	uris?: MemberURI[],
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
							return getMemberAPIdetails(uri);
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
