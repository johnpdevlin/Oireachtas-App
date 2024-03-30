/** @format */
import getDocsFromDB from './[uri]';
import { GroupType } from '@/models/_utils';

export default async function getDocsBatchFromDB<T>(
	collection: string,
	params: {
		group_type: GroupType;
		id: string;
	}[]
): Promise<Record<string, T[]>> {
	let batch: Record<string, T[]> = {};

	for (const param of params) {
		const { group_type, id } = param;
		const key = group_type.toString(); // Convert GroupType enum to string
		if (!batch[key]) {
			batch[key] = []; // Initialize the array if not already initialized
		}
		batch[key].push(...((await getDocsFromDB(collection, id)) as T[]));
	}

	return batch;
}
