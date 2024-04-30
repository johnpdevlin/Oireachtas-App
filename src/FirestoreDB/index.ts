/** @format */

import admin, { ServiceAccount } from 'firebase-admin';
import serviceAccount from './service-account-key.json';

if (!admin.apps.length) {
	try {
		admin.initializeApp({
			credential: admin.credential.cert(serviceAccount as ServiceAccount),
		});
	} catch (error) {
		console.log('Firebase admin initialization error...', error);
	}
}

const firestore = admin.firestore();
export default firestore;
