/** @format */
import { MemberRequest, RawMember } from '@/Models/OireachtasAPI/member';
import fetchMembers from '@/Functions/APIs/Oireachtas/Member/Get/Raw/get';
import scrapeMemberOirProfile, { MemberOirProfile } from './memberProfile';
import { MemberURI } from '@/Models/_util';

export default async function getMultiMembersAPIdetails(
	uris?: MemberURI[],
	request?: MemberRequest
): Promise<MemberOirProfile[] | void> {
	try {
		if (!uris && request!) {
			uris = (await fetchMembers(request))?.map(
				(member: RawMember) => member.uri
			);
			if (uris!) {
				return Promise.all(
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
