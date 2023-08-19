/** @format */

import Link from 'next/link';
import Image from 'next/image';

// INTERNAL COMPONENTS
import logo from '../Images/logo.png';

export const LogoButton = (): JSX.Element => {
	return (
		<Link href='/'>
			<Image src={logo} height={80} width={250} />
		</Link>
	);
};
