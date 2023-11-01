/** @format */

import { getCurrentYear } from '@/functions/_utils/dates';

type WebsiteDetailProps = {
	owner: string;
	currentYear: number;
	links: {
		github?: string;
		twitter?: string;
	};
};

const details: WebsiteDetailProps = {
	owner: 'John Devlin',
	currentYear: getCurrentYear(),
	links: {
		github: 'https://www.github.com/johnpdevlin/oireachtas-app/',
		twitter: 'https://www.x.com/',
	},
};

export default details;
