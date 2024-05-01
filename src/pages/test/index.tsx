/** @format */
import Head from 'next/head';
import Layout from '@/Components/_layout';

export default function Test() {
	return (
		<>
			<Head>
				<title>TEST</title>
				<meta name='description' content={`This is a test`} />
			</Head>
			<Layout>
				<h1>HELLO WORLD!!!</h1>
			</Layout>
		</>
	);
}
