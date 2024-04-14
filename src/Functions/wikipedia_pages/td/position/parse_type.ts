/** @format */

import { WikiPositionType } from '@/models/member/wiki_profile';

export default function parseWikiPositionType(title: string): WikiPositionType {
	title = title.toLowerCase();

	// Teachta Dála
	if (title.includes('teachta dála')) return 'td';

	if (title.includes('senator')) return 'senator';

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

	if (title.includes('chief whip')) return 'government chief whip';

	// Committee Chair
	if (title.includes('committee') && title.includes('chair'))
		return 'committee chair';

	// Leaders
	if (title.includes('leader') || title.includes('president')) {
		if (title.includes('opposition')) return 'leader of the opposition';
		else if (title.includes('eurogroup')) return 'eurogroup president';
		else if (title.includes('deputy') || title.includes('vice'))
			return 'party deputy leader';
		else return 'party leader';
	}

	// Mayor
	if (title.includes('mayor')) return 'mayor';

	// Party Chair
	if (title.includes('chair') && title.includes('party')) return 'party chair';

	// Councillor
	if (
		title.includes('councillor') ||
		(title.includes('council') && title.includes('member of'))
	)
		return 'councillor';

	// MEP
	if (title.includes('member of the european parliament')) return 'mep';

	// European Commissioner
	if (title.includes('european commissioner')) return 'european commissioner';

	// Default to 'other'
	return 'other';
}
