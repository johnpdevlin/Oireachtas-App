/** @format */

import checkIsSitting from './CheckIsSitting';

export default async function checkDatesSitting(dates: Date[]): Promise<{
	dailSitting: Date[];
	dailNotSitting: Date[];
	seanadSitting: Date[];
	seanadNotSitting: Date[];
}> {
	// arrays to hold dates
	const dailSitting: Date[] = [];
	const dailNotSitting: Date[] = [];
	const seanadSitting: Date[] = [];
	const seanadNotSitting: Date[] = [];
	// const committees: Set<string> = new Set();
	// const committeesSitting: {
	// 	name: string;
	// 	uri: string;
	// 	datesSitting: Date[];
	// 	notSitting: Date[];
	// }[] = [];

	for (let d of dates) {
		// loops through dates to retrieve records of dates houses sat
		const s = await checkIsSitting(d);

		if (s.dailSitting == true) {
			dailSitting.push(d);
		} else if (s.dailSitting == false) {
			dailNotSitting.push(d);
		}

		if (s.seanadSitting == true) {
			seanadSitting.push(d);
		} else if (s.seanadSitting == false) {
			seanadNotSitting.push(d);
		}

		// if (s.committeeSitting == true) {
		// 	for (let c of s.committeesSitting) {
		// 		committees.add(c.uri);
		// 		committeesSitting.push({c.name, c.uri, datesSitting});
		// 	}
		// 	// console.log(s.committeesSitting);
		// 	// committees.push(s.committeesSitting.uri);
		// 	// committeesSitting.push({name: s.committeesSittingname, uri: s.uri, datesSitting: });
		// }
		// // else{

		// // }
	}

	console.log(
		`Dates checked... 
		\nDates: ${dates.length} 
		\ndailSitting: ${dailSitting.length} 
		\ndailNotSitting: ${dailNotSitting.length}
		\nseanadSitting: ${seanadSitting.length} 
		\nseanadNotSitting: ${seanadNotSitting.length}`
	);

	return { dailSitting, dailNotSitting, seanadSitting, seanadNotSitting };
}
