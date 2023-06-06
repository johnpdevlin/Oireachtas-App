/** @format */

import { Container } from '@mui/material';
import Footer from './Footer';
import Header from './Header';

export default function Layout(props: {
	children: React.ReactNode;
	title?: string;
}) {
	return (
		<>
			<Header />
			<main>{props.children}</main>
			<Footer />
		</>
	);
}
