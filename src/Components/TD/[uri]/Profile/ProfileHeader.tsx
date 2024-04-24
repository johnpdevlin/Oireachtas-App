/** @format */
import { capitaliseFirstLetters } from '@/functions/_utils/strings';
import { MemberPageMembership } from '@/models/pages/member/member';
import { Stack, Typography } from '@mui/material';

export default function ProfileHeader(props: {
	name: string;
	offices?: MemberPageMembership[];
	partyPositions?: MemberPageMembership[];
	otherPositions?: MemberPageMembership[];
	textAlign: string;
}): JSX.Element {
	const { name, offices, partyPositions, otherPositions, textAlign } = props;
	const formatPositions = (
		positions: MemberPageMembership[]
	): string | undefined => {
		return positions
			?.filter((o) => !o.dateRange.end)
			.map((o, key) => {
				return capitaliseFirstLetters(o.name);
			})
			.join(', ');
	};

	const formattedPositions = () => {
		const memberships = [];
		if (offices!) memberships.push(...offices);
		if (partyPositions!) memberships.push(...partyPositions);
		if (otherPositions!) memberships.push(...otherPositions);

		return formatPositions(memberships);
	};

	return (
		<>
			<Stack direction='column'>
				<Typography
					variant='h2'
					color='secondary'
					sx={{ whiteSpace: 'nowrap', textAlign: `${textAlign}` }}
					title={name}>
					{name}
				</Typography>

				{(offices || partyPositions || otherPositions) && (
					<Typography
						variant='h6'
						sx={{ whiteSpace: 'pre-line', textAlign: `${textAlign}` }}
						title={'Member current offices and party role(s)'}>
						{formattedPositions()}
					</Typography>
				)}
			</Stack>
		</>
	);
}
