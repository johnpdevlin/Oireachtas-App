/** @format */

type SchoolDetails = {
	name: string;
	location: string;
	wikiUrl: string;
	isPrivate: boolean;
	gender: 'male' | 'female' | 'mixed';
	// HOW TO DEAL WITH?
	denomination: ReligiousAffiliation;
};

type ReligiousAffiliation = 'christian brothers' | 'augustinian' | '';
