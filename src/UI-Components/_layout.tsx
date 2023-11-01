/** @format */

import Footer from './Footer/footer';
import Header from './Header';

export default function Layout(props: { children: JSX.Element }) {
	return (
		<>
			<Header />
			<main>{props.children}</main>
			<Footer />
		</>
	);
}
