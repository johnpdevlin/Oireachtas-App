/** @format */

export type WikiTDProfileDetails = {
	wikiName?: string;
	wikiURI: string;
	birthDate?: Date | string;
	birthPlace?: string;
	birthCountry?: string;
	education?: { name: string; wikiURI: string | undefined }[];
	almaMater?: { name: string; wikiURI: string | undefined }[];
	marriageDetails?: string;
	numOfChildren?: number;
	websiteUrl?: string;
};
