/** @format */
import { MemberRequest, RawMember } from '@/models/oireachtasApi/member';
import fetchMembers from '../../../APIs/Oireachtas/member/raw/_member_details';
import scrapeMemberOirProfile, { MemberOirProfile } from './td_profile';

export default async function getMultiMembersOirdetails(
	uris?: string[],
	request?: MemberRequest
): Promise<MemberOirProfile[] | void> {
	try {
		if (!uris && request!) {
			uris = (await fetchMembers(request))?.map(
				(member: RawMember) => member.uri
			);
			if (uris!) {
				const results = Promise.all(
					uris.map((uri) => {
						return scrapeMemberOirProfile(uri);
					})
				) as Promise<MemberOirProfile[]>;
			}
		} else if (uris!) {
			return Promise.all(
				uris!.map((uri) => {
					return scrapeMemberOirProfile(uri);
				})
			) as Promise<MemberOirProfile[]>;
		} else {
			console.error('no uris or request parameters provided.');
		}
	} catch (err) {
		console.log(err);
	}
}
