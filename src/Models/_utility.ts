/** @format */

export type ChamberType = 'house' | 'committee';
export type Chamber = 'dail' | 'seanad' | 'dail & seanad';
export type RepresentType = 'constituency' | 'panel';
export type Outcome = 'carried' | 'lost';
export type QuestionType = 'oral' | 'written';
export type DateRange = {
	date_start: Date | string;
	date_end: Date | string;
};
export type URIpair = {
	name: string;
	uri: string;
};
