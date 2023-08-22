/** @format */

import React, { createContext, useContext, useEffect, useState } from 'react';

interface ViewportContextProps {
	width: number;
	height: number;
	breakpoint: string;
}

const ViewportContext = createContext<ViewportContextProps>({
	width: 0,
	height: 0,
	breakpoint: '',
});

interface ViewportProviderProps {
	children: React.ReactNode;
}

const ViewportProvider: React.FunctionComponent<ViewportProviderProps> = ({
	children,
}) => {
	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);
	const [breakpoint, setBreakpoint] = useState('');

	const handleWindowResize = () => {
		setWidth(window.innerWidth);
		setHeight(window.innerHeight);
		updateBreakpoint(window.innerWidth);
	};

	const updateBreakpoint = (width: number) => {
		if (width < 600) {
			setBreakpoint('xs');
		} else if (width < 960) {
			setBreakpoint('sm');
		} else if (width < 1280) {
			setBreakpoint('md');
		} else if (width < 1920) {
			setBreakpoint('lg');
		} else {
			setBreakpoint('xl');
		}
	};

	useEffect(() => {
		// Make sure this code only runs on the client side
		if (typeof window !== 'undefined') {
			setWidth(window.innerWidth);
			setHeight(window.innerHeight);
			updateBreakpoint(window.innerWidth);
			window.addEventListener('resize', handleWindowResize);
			return () => window.removeEventListener('resize', handleWindowResize);
		}
	}, []);

	return (
		<ViewportContext.Provider value={{ width, height, breakpoint }}>
			{children}
		</ViewportContext.Provider>
	);
};

const useViewport = (): ViewportContextProps => {
	const { width, height, breakpoint } = useContext(ViewportContext);
	return { width, height, breakpoint };
};

export { ViewportProvider, useViewport };
