/** @format */

import { PartyCode } from '@/models/_utils';

export function getPartyColor(partyCode: PartyCode): string {
	switch (partyCode) {
		case 'Social_Democrats':
			return '#ab47bc';
		case 'Sinn_Féin':
			return '#388e3c';
		case 'Fianna_Fáil':
			return '#66bb6a';
		case 'Fine_Gael':
			return '#0288d1';
		case 'Labour_Party':
			return '#d32f2f';
		case 'People_Before_Profit_Solidarity':
			return '#e57373';
		case 'Anti-Austerity_Alliance_People_Before_Profit':
			return '#f44336';
		case 'Independent':
			return '#e3f2fd';
		case 'Green_Party':
			return '#81c784';
		case 'Independents_4_Change':
			return '#ffb74d';
		case 'Aontú':
			return '#FF5733';
		case 'Renua':
			return '#FF5733';
		case 'Socialist_Party':
			return '#f3e5f5';
		case 'Workers_and_Unemployed_Action':
			return '#ffb74d';
		default:
			return '#4fc3f7';
	}
}
