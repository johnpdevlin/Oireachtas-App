/** @format */

import { DebateRecord } from '@/models/oireachtas_api/debate';
import fetchDebates from '../../debate/_index';
import fetchHouses from '../../house/_index';
async function fetchAllBaseCommittees() {
	const processedCommittees = new Map<string, {}>();
	const houses = await fetchHouses({}).then((houses) =>
		houses.filter((h) => h.houseCode === 'dail')
	);
	const debates: DebateRecord[] = [];

	// Use for...of loop for proper handling of async/await
	for (const house of houses) {
		const { start, end } = house.dateRange;
		const houseDebates = (await fetchDebates({
			date_start: start,
			date_end: end ?? new Date().toISOString(), // Use toISOString for proper date format
			formatted: false,
			chamber_type: 'committee',
		})) as DebateRecord[];

		debates.push(...houseDebates);
	}

	// Processing committees after all debates have been fetched
	debates.forEach((deb) => {
		const committee = deb.house;
		processedCommittees.set(deb.house.uri, committee);
	});

	return Array.from(processedCommittees.values());
}

export { fetchAllBaseCommittees };
