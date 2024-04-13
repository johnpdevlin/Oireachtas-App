/** @format */
import AttendanceSection from '../../[uri]/Attendance/_AttendanceSection';
import RecordsTabs from '../../[uri]/Participation/_RecordsTabs';
import MemberProfile from '../../[uri]/Profile/_MemberProfile';
import { Grid, Stack } from '@mui/material';
import { MemberPageBioData } from '@/models/pages/member/member';

import { AttendanceData } from '@/models/pages/attendance';

type LayoutProps = {
	bio: MemberPageBioData;
	attendance: AttendanceData;
};

export default function TDlayout({ bio, attendance }: LayoutProps) {
	const firstElected = (): Date => {
		const dailStart = bio.constituencies.dail?.at(-1)?.dateRange.start;
		const seanadStart = bio.constituencies.seanad?.at(-1)?.dateRange.start;

		if (dailStart! && seanadStart!) {
			if (new Date(dailStart) < new Date(seanadStart))
				return new Date(dailStart);
		} else if (dailStart!) return new Date(dailStart);

		return new Date(seanadStart!);
	};
	return (
		<>
			<MemberProfile bio={bio} />
			<Grid container>
				<Grid item lg={1} />
				<Grid item lg={11}>
					<Stack gap={8}>
						<AttendanceSection bio={bio} attendance={attendance} />
						<RecordsTabs
							minDate={firstElected()}
							maxDate={new Date()}
							member={bio.uri}
						/>
					</Stack>
				</Grid>
			</Grid>
		</>
	);
}
