/** @format */
export type Gender = 'male' | 'female';

export type ChamberType = 'house' | 'committee';
export type BinaryChamber = 'dail' | 'seanad';
export type Chamber = BinaryChamber | 'dail & seanad';
export type CommitteeType = 'select' | 'joint' | 'standing' | 'working group';
export type RepresentType = 'constituency' | 'panel';

export type Outcome = 'carried' | 'lost';
export type QuestionType = 'oral' | 'written';

export type MemberBaseKeys = { house_code: BinaryChamber } & URIpair;
export type URIpair = {
	name: string;
	uri: string;
};

export type GroupType =
	| 'dail'
	| 'seanad'
	| 'party'
	| 'constituency'
	| 'member'
	| 'committee';

export type PartyCode =
	| 'Social_Democrats'
	| 'Sinn_Féin'
	| 'Fianna_Fáil'
	| 'Fine_Gael'
	| 'Labour_Party'
	| 'People_Before_Profit_Solidarity'
	| 'Anti-Austerity_Alliance_People_Before_Profit'
	| 'Independent'
	| 'Green_Party'
	| 'Independents_4_Change'
	| 'Aontú'
	| 'Renua'
	| 'Socialist_Party'
	| 'Workers_and_Unemployed_Action';
