/** @format */

import { CommitteeAttendance } from "@/models/committee";
import processCommitteeReportsBetweenDates from "../report/_committee_attendance";
import { groupByKey } from "@/functions/_utils/objects";

async function getAggAllMemberCommitteeAttendanceRecords(records: CommitteeAttendance[]
	
) {


	const grouped = groupByKey(records, 'year');

	const processed = aggregateAllMembersAttendance(grouped);
	console.info(processed);
}

function aggregateAllMembersAttendance(records: Record<number, CommitteeAttendance[]>){
    let processed: Record<string, CommitteeAttendance> = {};
    for (let r in records) {
        const years = records[r];
        processed[r] = 

    }
}

function aggregateYears(records: CommitteeAttendance[]){

}