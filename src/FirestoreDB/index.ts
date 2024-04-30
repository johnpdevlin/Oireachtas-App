/** @format */

import admin, { ServiceAccount } from 'firebase-admin';

const serviceAccount = {
	type: 'service_account',
	project_id: process.env.FIREBASE_PROJECT_ID,
	private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Replace escaped newline characters
	private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
	client_email: process.env.FIREBASE_CLIENT_EMAIL,
	client_id: process.env.FIREBASE_CLIENT_ID,
	auth_uri: process.env.FIREBASE_AUTH_URI,
	token_uri: process.env.FIREBASE_TOKEN_URI,
	auth_provider_x509_cert_url:
		process.env.FIREBASE_AUTH_PROVIDER_x509_CERT_URL!,
	client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
	universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

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
