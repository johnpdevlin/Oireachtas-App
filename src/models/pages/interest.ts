/** @format */

export type PageInterest = {
	uri: string;
	dateDeclared: string;
	year: number;
	url: string;
} & Omit<RawMemberInterests, 'name'>;
