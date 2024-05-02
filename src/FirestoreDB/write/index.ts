/** @format */

type FirestoreData = {
	[key: string]: any;
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

		const response = await fetch(url, { method: 'POST' });

		return response.json();
	} catch (error) {
		throw error; // Re-throw the error to handle retries
	}
};

type ObjWithRetry<T> = {
	obj: T;
	retryCount: number;
};

export async function writeObjsToFirestore<T>(
	collection: string,
	objs: T[]
): Promise<void> {
	const objsWithRetry: ObjWithRetry<T>[] = objs.map((obj) => ({
		obj,
		retryCount: 1,
	}));
	await writeObjsToFirestoreWithRetry(collection, objsWithRetry);
	console.info('Writing process completed.');
}

async function writeObjsToFirestoreWithRetry<T>(
	collection: string,
	objs: ObjWithRetry<T>[]
): Promise<void> {
	const MAX_RETRY_ATTEMPTS = 5;
	const failedObjs: ObjWithRetry<T>[] = [];

	for (const obj of objs) {
		try {
			if (obj.obj) await writeObjToFirestore(collection, obj.obj);
		} catch (error) {
			console.error(`Failed to write object to Firestore:`, error);
			if (obj.retryCount < MAX_RETRY_ATTEMPTS) {
				failedObjs.push({ obj: obj.obj, retryCount: obj.retryCount + 1 });
			}
		}
	}

	if (failedObjs.length > 0) {
		console.log(`Retrying failed objects after a delay...`);
		const delayMultiplier = Math.pow(2, failedObjs[0].retryCount - 1);
		const delay = 5000 * delayMultiplier; // Initial delay with exponential backoff
		await delayExecution(delay);
		await writeObjsToFirestoreWithRetry(collection, failedObjs);
	}
}

async function delayExecution(delay: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, delay));
}
