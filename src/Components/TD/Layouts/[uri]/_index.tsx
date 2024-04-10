/** @format */

import { MemberPageData } from '@/models/ui/member';
import { useViewport } from '@/hooks/viewportProvider';
import { getPartyColor } from '@/functions/_utils/parties';
import { PartyCode } from '@/models/_utils';
import AttendanceSection from '../../[uri]/Attendance/_AttendanceSection';
import RecordsTabs from '../../[uri]/Participation/_RecordsTabs';
import MemberProfile from '../../[uri]/Profile/_MemberProfile';

export default function TDlayout({ bio, attendance }: MemberPageData) {
	const membershipKeys = [
		{ uri: 'member', name: bio.fullName, color: '#FF1493' },
		{
			uri: 'party',
			name: bio.parties[0].name,
			color: getPartyColor(bio.parties[0].uri as PartyCode),
		},
		{
			uri: 'constituency',
			name: bio.constituencies.dail![0].name,
			color:
				bio.constituencies.dail![0].uri ===
				('Independents_4_Change' || 'Workers_and_Unemployed_Action')
					? '#4fc3f7'
					: '#ffb74d',
		},
		{ uri: 'dail', name: 'Dáil', color: '#000000' },
	];

	const { width, height, breakpoint } = useViewport();

	const firstElected = (): Date => {
		if (bio.isActiveTD!)
			return new Date(
				bio.constituencies!.dail!.at(-1)!.dateRange.start! as string
			)!;
		else if (bio.isActiveSenator!)
			return new Date(
				bio.constituencies!.seanad!.at(-1)!.dateRange.start! as string
			)!;
	};
	return (
		<>
			<MemberProfile bio={bio} />
			<AttendanceSection bio={bio} attendance={attendance} />
			<RecordsTabs
				minDate={firstElected()}
				maxDate={new Date()}
				member={bio.uri}
			/>
		</>
	);
}
