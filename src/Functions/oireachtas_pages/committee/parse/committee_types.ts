/** @format */

import { CommitteeType } from '@/models/_utils';
import * as cheerio from 'cheerio';

function getCommitteeTypes(
	$: cheerio.CheerioAPI,
	uri: string
): CommitteeType[] {
	const types: CommitteeType[] = [];
	if ($('#joint').length > 0) types.push('joint');
	if ($('#select').length > 0) types.push('select');
	if ($('#standing').length > 0)
		if (uri.includes('dáil') || uri.includes('seanad')) types.push('select');
		else types.push('standing');
	return types;
}

export { getCommitteeTypes };
