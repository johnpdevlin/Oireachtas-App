/** @format */
import { MemberRequest, RawMember } from '@/models/oireachtas_api/member';
import fetchMembers from '../../../APIs/Oireachtas/member/raw/_member_details';
import scrapeMemberOirProfile from './td_profile';
import { MemberOirProfileData } from '@/models/member/oir_profile';

export default async function getMultiMembersOirdetails(
	uris?: string[],
	request?: MemberRequest
): Promise<MemberOirProfileData[] | void> {
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
				) as Promise<MemberOirProfileData[]>;
			}
		} else if (uris!) {
			return Promise.all(
				uris!.map((uri) => {
					return scrapeMemberOirProfile(uri);
				})
			) as Promise<MemberOirProfileData[]>;
		} else {
			console.error('no uris or request parameters provided.');
		}
	} catch (err) {
		console.log(err);
	}
}
