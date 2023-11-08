/** @format */
import { capitaliseFirstLetters } from '@/functions/_utils/strings';
import { MemberOffice } from '@/models/oireachtasApi/Formatted/Member/office';
import { Stack, Typography } from '@mui/material';
export default function ProfileHeader(props: {
	name: string;
	offices: MemberOffice[] | undefined;
	textAlign: string;
}): JSX.Element {
	const formattedOffices = (): string | undefined => {
		if (props.offices!) {
			const mapped = props.offices?.map((o, key) => {
				return capitaliseFirstLetters(o.name);
			});
			return mapped.join(', ');
		}
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
				<Typography
					variant='h6'
					sx={{ whiteSpace: 'pre-line', textAlign: `${props.textAlign}` }}
					title={'Member current offices and party role(s)'}>
					{formattedOffices! && formattedOffices()}
				</Typography>
				{/* REQUIRES F()s to be fully implemented */}
			</Stack>
		</>
	);
}
