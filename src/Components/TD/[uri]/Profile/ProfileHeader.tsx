/** @format */
import { capitaliseFirstLetters } from '@/functions/_utils/strings';
import { MemberOffice } from '@/models/oireachtas_api/Formatted/Member/office';
import { MemberPageMembership } from '@/models/pages/member/member';
import { Stack, Typography } from '@mui/material';
export default function ProfileHeader(props: {
	name: string;
	offices?: MemberPageMembership[];
	textAlign: string;
}): JSX.Element {
	const formattedOffices = (): string | undefined => {
		if (props.offices!)
			return props.offices
				?.filter((o) => !o.dateRange.end)
				.map((o, key) => {
					return capitaliseFirstLetters(o.name);
				})
				.join(', ');

		return;
	};

	return (
		<>
			<Stack direction='column'>
				<Typography
					variant='h2'
					sx={{ whiteSpace: 'nowrap', textAlign: `${props.textAlign}` }}
					title={props.name}>
					{props.name}
				</Typography>
				{/* REQUIRES F()s to be fully implemented */}
				{formattedOffices! && (
					<Typography
						variant='h6'
						sx={{ whiteSpace: 'pre-line', textAlign: `${props.textAlign}` }}
						title={'Member current offices and party role(s)'}>
						{formattedOffices()}
					</Typography>
				)}
				{/* REQUIRES F()s to be fully implemented */}
			</Stack>
		</>
	);
}
