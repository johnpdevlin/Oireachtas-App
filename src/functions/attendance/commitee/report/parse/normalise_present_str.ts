/** @format */

import {
	capitaliseFirstLetters,
	removeTextAfterOpeningParenthesis,
	removeTextBeforeClosingParenthesis,
	removeTextBetweenParentheses,
} from '@/functions/_utils/strings';

function normalisePresentStr(presence: string): string | undefined {
	// remove unneccessary characters
	if (presence == undefined || presence.length < 5 || !presence.includes(' ')) {
		return undefined;
	}

	let pr = presence.toLowerCase().trim();
	pr = removeEndSymbols(pr);
	pr = removeSymbols(pr);
	pr = removeWords(pr);
	pr = removeEndSymbols(pr);

	if (pr.length < 5 && !pr.includes(' ')) {
		return undefined;
	}

	pr = capitaliseFirstLetters(pr.trim());
	return pr;
}

function removeEndSymbols(pr: string): string {
	if (pr.endsWith('.')) pr = pr.slice(0, -1);
	if (pr.endsWith(',')) pr = pr.slice(0, -1);
	if (pr.includes('(')) {
		if (pr.includes(')')) pr = removeTextBetweenParentheses(pr);
		else pr = removeTextAfterOpeningParenthesis(pr);
	} else if (pr.includes(')')) pr = removeTextBeforeClosingParenthesis(pr);
	return pr;
}

function removeSymbols(pr: string): string {
	if (pr.includes('’')) pr = pr.replaceAll('’', "'");
	if (pr.includes('/')) pr = pr.replaceAll('/', '');
	if (pr.includes('+')) pr = pr.replaceAll('+', '');
	if (pr.includes('*')) pr = pr.replaceAll('*', '');
	if (pr.includes(':')) pr = pr.replaceAll(':', '');
	return pr;
}

function removeWords(pr: string): string {
	if (pr.includes('deputies')) pr = pr.replaceAll('deputies', '');
	if (pr.includes('deputy')) pr = pr.replaceAll('deputy', '');
	if (pr.includes('senators')) pr = pr.replaceAll('senators', '');
	if (pr.includes('senator')) pr = pr.replaceAll('senator', '');
	if (pr.includes('ministers')) pr = pr.replaceAll('ministers', '');
	if (pr.includes('minister')) pr = pr.replaceAll('minister', '');
	if (pr.includes('taoiseach')) pr = pr.replaceAll('taoiseach', '');
	if (pr.includes('tanaiste')) pr = pr.replaceAll('tanaiste', '');
	if (pr.includes('ceann comhairle')) pr = pr.replaceAll('ceann comhairle', '');
	if (pr.includes('teachtaí')) pr = pr.replaceAll('teachtaí', '');
	if (pr.includes('dála')) pr = pr.replaceAll('dála', '');
	if (pr.includes('teachta')) pr = pr.replaceAll('teachta', '');
	if (pr.includes('dáil')) pr = pr.replaceAll('dáil', '');
	if (pr.includes('seanadóirí')) pr = pr.replaceAll('seanadóirí', '');
	if (pr.includes('seanadóir')) pr = pr.replaceAll('seanadóir', '');
	if (pr.includes('cathaoirleach')) pr = pr.replaceAll('cathaoirleach', '');
	if (pr.includes('department')) pr = pr.replaceAll('department', '');
	if (pr.includes('government')) pr = pr.replaceAll('government', '');
	if (pr.includes('development')) pr = pr.replaceAll('development', '');
	if (pr.includes('local ')) pr = pr.replaceAll('local ', '');

	if (pr.includes('i láthair')) pr = pr.replace('i láthair', '');
	if (pr.includes('le haghaidh cuid den choiste'))
		pr = pr.replace('le haghaidh cuid den choiste', '');
	if (pr.includes('in the absence for part of the meeting of'))
		pr = pr.replace('in the absence for part of the meeting of', '');
	if (pr.includes('for part of the meeting of'))
		pr = pr.replace('for part of the meeting of', '');
	if (pr.includes('in éagmais')) pr = pr.replace('in éagmais', '');
	if (pr.includes('in the chair')) pr = pr.replace('in the chair', '');
	if (pr.includes('sa chathaoir')) pr = pr.replace('sa chathaoir', '');
	if (pr.includes('comhaltaii a bhi')) pr = pr.replace('comhaltai a bhi', '');
	if (pr.includes('of ')) pr = pr.replace('of', '');
	if (pr.includes('for ')) pr = pr.replace('for', '');
	if (pr.includes('the ')) pr = pr.replace('the', '');
	return pr;
}

export { normalisePresentStr };
