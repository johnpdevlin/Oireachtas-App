/** @format */

import { BinaryChamber, CommitteeType } from '@/Models/_util';

export type CommitteeDebateRecord = {
	date: Date;
	dateStr: string;
	rootName: string;
	name: string;
	type: CommitteeType;
	chamber: BinaryChamber;
	houseNo: number;
	rootURI: string;
	uri: string; // to differentiate for joint, select etc.
	pdf: string;
	xml: string;
};