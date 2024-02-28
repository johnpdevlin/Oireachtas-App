/** @format */
import { aggregateDatesToMonthsArray } from '@/functions/_utils/dates';
import {
	AttendanceRecord,
	SittingDaysRecord,
} from '../../../../models/attendance';
import { initializeAttendanceSummary } from '../../_utils/init_attendance_summary';
import { addPresentPercentage } from '../../_utils/add_percentage_calculations';

function getMemberHouseAttendanceRecord(
	record: SittingDaysRecord,
	possibleSittings: Date[]
): AttendanceRecord {
	const attendanceRecord = initializeAttendanceSummary(
		record.uri!,
		record.year!,
		'member'
	) as AttendanceRecord;

	attendanceRecord.present = aggregateDatesToMonthsArray(record.sittingDates);
	attendanceRecord.also_present = aggregateDatesToMonthsArray(
		record.otherDates
	);

	attendanceRecord.dateRange = record.dateRange;
	const { start, end } = record.dateRange;

	// Gets sitting dates relevant for record period
	const relevantSittings = possibleSittings.filter(
		(s) => s >= start && s <= end!
	);
	attendanceRecord.absent = getAbsent(
		relevantSittings,
		attendanceRecord.present.flat()
	);

	const processedAttendance = addPresentPercentage(
		attendanceRecord
	) as AttendanceRecord;

	return processedAttendance;
}

function getAbsent(relevant: Date[], present: Date[]): Date[][] {
	const absentMap = new Map<string, Date>();

	relevant.forEach((rel) => {
		if (!present.find((pres) => pres.getTime() === rel.getTime()))
			absentMap.set(rel.toString(), rel);
	});

	const absent = aggregateDatesToMonthsArray(Array.from(absentMap.values()));
	return absent;
}

export { getMemberHouseAttendanceRecord };
