/** @format */

import {
	capitaliseFirstLetters,
	removeTextAfterOpeningParenthesis,
	removeTextBeforeClosingParenthesis,
	removeTextBetweenParentheses,
} from '@/functions/_utils/strings';

function normalisePresentStr(pr: string): string | undefined {
	// remove unneccessary characters
	if (pr == undefined || pr.length < 5 || !pr.includes(' ')) {
		return undefined;
	}
	pr = pr.toLowerCase().trim();

	if (pr.includes('’')) pr.replace('’', "'");
	if (pr.includes('/')) pr = pr.replaceAll('/', '');
	if (pr.includes('+')) pr = pr.replaceAll('+', '');
	if (pr.includes('*')) pr = pr.replaceAll('*', '');
	if (pr.includes(':')) pr = pr.replaceAll(':', '');
	if (pr.endsWith('.')) pr = pr.slice(0, -1);
	if (pr.endsWith(',')) pr = pr.slice(0, -1);
	if (pr.includes('(')) {
		if (pr.includes(')')) pr = removeTextBetweenParentheses(pr);
		else pr = removeTextAfterOpeningParenthesis(pr);
	} else if (pr.includes(')')) pr = removeTextBeforeClosingParenthesis(pr);

	if (pr.includes('deputies')) pr = pr.replace('deputies', '');
	if (pr.includes('deputy')) pr = pr.replaceAll('deputy', '');
	if (pr.includes('senators')) pr = pr.replace('senators', '');
	if (pr.includes('senator')) pr = pr.replaceAll('senator', '');
	if (pr.includes('ministers')) pr = pr.replace('ministers', '');
	if (pr.includes('minister')) pr = pr.replaceAll('minister', '');
	if (pr.includes('taoiseach')) pr = pr.replace('taoiseach', '');
	if (pr.includes('tánaiste')) pr = pr.replace('tánaiste', '');
	if (pr.includes('ceann comhairle')) pr = pr.replace('ceann comhairle', '');
	if (pr.includes('teachtaí')) pr = pr.replace('teachtaí', '');
	if (pr.includes('dála')) pr = pr.replace('dála', '');
	if (pr.includes('teachta')) pr = pr.replaceAll('teachta', '');
	if (pr.includes('dáil')) pr = pr.replaceAll('dáil', '');
	if (pr.includes('seanadóirí')) pr = pr.replace('seanadóirí', '');
	if (pr.includes('seanadóir')) pr = pr.replaceAll('seanadóir', '');
	if (pr.includes('cathaoirleach')) pr = pr.replace('cathaoirleach', '');

	if (pr.includes('i láthair')) pr = pr.replace('i láthair', '');
	if (pr.includes('Le Haghaidh Cuid Den Choiste'))
		pr.replace('Le Haghaidh Cuid Den Choiste', '');
	if (pr.includes('In The Absence For Part Of The Meeting Of'))
		pr.replace('In The Absence For Part Of The Meeting Of', '');
	if (pr.includes('For Part Of The Meeting Of'))
		pr.replace('For Part Of The Meeting Of', '');
	if (pr.includes('in éagmais')) pr = pr.replace('in éagmais', '');
	if (pr.includes('in the chair')) pr = pr.replace('in the chair', '');
	if (pr.includes('sa chathaoir')) pr = pr.replace('sa chathaoir', '');
	if (pr.includes('comhaltaí a bhí')) pr = pr.replace('comhaltaí a bhí', '');

	if (pr.length < 5 && !pr.includes(' ')) {
		return undefined;
	}

	pr = capitaliseFirstLetters(pr.trim());
	return pr;
}

export { normalisePresentStr };
