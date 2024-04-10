/** @format */

import Footer from './Footer/Footer';
import Header from './Header';

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
				<main style={{ flex: 1, marginBottom: '60px' }}>{props.children}</main>
				<Footer />
			</div>
		</>
	);
}
