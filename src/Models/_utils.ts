/** @format */

import { DailYear, ValidMonthStr } from '@/models/dates';

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

export type GroupType = 'dail' | 'seanad' | 'party' | 'constituency' | 'member';
