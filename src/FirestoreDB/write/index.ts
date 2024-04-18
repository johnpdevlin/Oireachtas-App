/** @format */

import axios from 'axios';

type FirestoreData = {
	[key: string]: any; // Define the structure of your data
};

export const writeObjToFirestore = async (
	collection: string,
	data: FirestoreData,
	id?: string,
	id_field?: string,
	overwrite?: boolean
): Promise<any> => {
	try {
		const token = process.env.API_SECRET;

		let url = `/api/firestore?&token=${token}&collection=${collection}&data=${JSON.stringify(
			data
		)}`;

		if (id) url += `&id=${id}`;
		if (id_field) url += `&id_field=${id_field}`;
		if (overwrite) url += `&overwrite=${overwrite}`;

		const response = await axios.post(url);

		return response.data;
	} catch (error) {
		console.error(error);
	}
};
