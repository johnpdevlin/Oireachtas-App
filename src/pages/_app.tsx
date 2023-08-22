/** @format */

import { ViewportProvider } from '@/hooks/viewportProvider';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps): JSX.Element {
	return (
		<>
			<ViewportProvider>
				<Component {...pageProps} />
			</ViewportProvider>
		</>
	);
}
