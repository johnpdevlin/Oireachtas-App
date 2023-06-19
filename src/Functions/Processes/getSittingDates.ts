/** @format */

import fetchDebates from '../API-Calls/OireachtasAPI/debates';
import { getUniqueDatesFromObjects } from '../Util/dates';

// Gets dates houses sat from Oireachtas API
export default async function getSittingDates(
	start: string,
	end: string
): Promise<{ dailSitting: string[]; seanadSitting: string[] }> {
	// Gets Raw Debate Data from Oireachtas API
	const dailDates = fetchDebates({
		date_start: start,
		date_end: end,
		chamber_type: 'house',
		chamber_id: 'dail',
		limit: 5000,
	});

	const seanadDates = fetchDebates({
		date_start: start,
		date_end: end,
		chamber_type: 'house',
		chamber_id: 'seanad',
		limit: 5000,
	});

	// Gets unique dates from raw data
	const dailSitting = getUniqueDatesFromObjects(await dailDates);
	const seanadSitting = getUniqueDatesFromObjects(await seanadDates);

	return { dailSitting, seanadSitting };
}
