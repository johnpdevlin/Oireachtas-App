/** @format */

import fetchDebates from '@/Functions/API-Calls/OireachtasAPI/debates';
import parseCommitteeReport from '@/Functions/GetWebsiteData/Oireachtas/Committee/Report/parseReport';
import scrapeCommitteeInfo, {
	Committee,
} from '@/Functions/GetWebsiteData/Oireachtas/Committee/ScrapeInfo/scapePageInfo';
import scrapeCommitteesBaseDetails from '@/Functions/GetWebsiteData/Oireachtas/Committee/ScrapeInfo/scrapeAllCommittees';
import {
	capitaliseFirstLetters,
	getStringAfterFirstTargetPoint,
} from '@/Functions/Util/strings';
import { DebateRecord } from '@/Models/OireachtasAPI/debate';
import { Chamber } from '../../../Models/_utility';
import processCommitteeReportsBetweenDates from '@/Functions/GetWebsiteData/Oireachtas/Committee/Report/prcReportsBetweenDates';
import processCommitteeAttendanceBetweenDates from '@/Functions/GetWebsiteData/Oireachtas/Committee/Report/prcAttendanceBetweenDates';

type CommitteeAttendance = {
	date: Date;
	name: string;
	uri: string;
	type: string;
	chamber: string;
	houseNo: number;
	pdf: string;
	xml: string;
	attendees: string[];
	alsoPresent: string[];
};
export default async function prcCommitteeReports(
	date_start: string,
	date_end?: string
) {
	processCommitteeAttendanceBetweenDates(date_start, date_end);
}
