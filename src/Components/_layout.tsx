/** @format */

import { Alert } from '@mui/material';
import Footer from '@/Components/Footer/Footer';
import Header from '@/Components/Header';

export default function Layout(props: { children: JSX.Element }) {
	return (
		<>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					minHeight: '100vh',
				}}>
				<Header />

				<Alert variant='outlined' severity='warning' sx={{ mx: 7, mb: 7 }}>
					This web application is still a work in progress.
				</Alert>
				<main style={{ flex: 1, marginBottom: '60px' }}>{props.children}</main>
				<Footer />
			</div>
		</>
	);
}
