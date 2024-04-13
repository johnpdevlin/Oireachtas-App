/** @format */

import { WebsitePair } from '@/functions/oireachtas_pages/td/profile/td_profile';

export type MemberOirProfileData = {
	uri: string;
	address: string;
	contactNumbers: string[];
	email: string;
	webpages: WebsitePair[];
};
