/** @format */

import { WikiPositionType } from '@/models/member/wiki_profile';

export default function parseWikiPositionType(
	title: string,
	href?: string
): WikiPositionType {
	title = title.toLowerCase();

	// Teachta Dála
	if (title.includes('teachta dála')) return 'td';
	if (title.includes('senator')) return 'senator';

	if (title.includes('chief whip'))
		if (title.includes('government')) return 'government chief whip';
		else if (title.includes('opposition')) return 'opposition chief whip';

	// Ceann Comhairle (and Leas)
	if (title.includes('leas-cheann comhairle')) return 'leas-cheann comhairle';
	if (title.includes('ceann comhairle')) return 'ceann comhairle';

	// Ministers
	if (
		title.includes('minister') ||
		title.includes('taoiseach') ||
		title.includes('tánaiste')
	) {
		if (title.includes('state')) return 'junior minister';
		else return 'senior minister';
	}

	// Committee Chair
	if (title.includes('committee') && title.includes('chair'))
		return 'committee chair';

	// Leaders
	if (title.includes('leader') || title.includes('president')) {
		if (title.includes('opposition')) return 'leader of the opposition';
		else if (title.includes('eurogroup')) return 'eurogroup president';
		else if (title.includes('dáil')) return 'party dáil leader';
		else if (title.includes('seanad'))
			if (title.includes('deputy')) return 'seanad deputy leader';
			else if (title.includes('party')) return 'party seanad leader';
			else return 'seanad leader';
		else if (title.includes('deputy') || title.includes('vice'))
			return 'party deputy leader';
		else return 'party leader';
	}

	// Mayor
	if (title.includes('mayor')) return 'mayor';

	// Party Chairs
	if (title.includes('chair')) {
		if (title.includes('parliamentary')) return 'parliamentary party chair';
		else if (title.includes('deputy') || title.includes('vice'))
			return 'party deputy chair';
		else return 'party chair';
	}
	// Councillor
	if (
		title.includes('councillor') ||
		(title.includes('council') && title.includes('member of'))
	)
		return 'councillor';

	// MEP
	if (title.includes('member of the european parliament')) return 'mep';

	// NI MLA
	if (title.includes('member of the legislative assembly')) return 'mla';

	// UK Member of Parliament
	if (href === '/wiki/Member_of_Parliament_(United_Kingdom)') return 'mp';

	// European Commissioner
	if (title.includes('european commissioner')) return 'european commissioner';

	// Default to 'other'
	return 'other';
}
