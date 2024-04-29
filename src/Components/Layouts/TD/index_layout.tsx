/** @format */
import { Box, FormControl, FormLabel, Grid, Stack } from '@mui/material';

import { useEffect, useState } from 'react';
import { PartyAPI } from '@/models/oireachtas_api/party';
import { ConstituencyAPI } from '@/models/oireachtas_api/constituency';
import { MemberAPIdetails } from '@/models/oireachtas_api/Formatted/Member/member';

import { useViewport } from '@/hooks/viewportProvider';
import MultipleSelect from '@/Components/_utils/Select/MultiSelect';
import TDcard from '@/Components/TD/_utils/TDcard';
type Option = {
	name: string;
	id: string;
};

export default function TDIndexLayout(props: {
	members: MemberAPIdetails[];
	parties: PartyAPI[];
	constituencies: ConstituencyAPI[];
}) {
	const [selectedParties, setSelectedParties] = useState<Option[]>([]);
	const [selectedConstits, setSelectedConstits] = useState<Option[]>([]);
	const [filteredMembers, setFilteredMembers] = useState<MemberAPIdetails[]>(
		() => {
			return props.members;
		}
	);

	const parties = props.parties.map((p) => {
		return { name: p.name, id: p.uri };
	});
	const constits = props.constituencies.map((c) => {
		return { name: c.name, id: c.uri };
	});

	useEffect(() => {
		let filtered: MemberAPIdetails[] = [];
		if (selectedParties.length === 0 && selectedConstits.length === 0) {
			filtered = props.members;
		} else if (selectedParties.length > 0 && selectedConstits.length > 0)
			filtered = props.members.filter(
				(m) =>
					selectedConstits.some(
						(c) => c.id === m.constituencies.dail![0].uri
					) && selectedParties.some((p) => p.id === m.parties[0].uri)
			);
		else if (selectedConstits.length > 0)
			filtered = props.members.filter((m) =>
				selectedConstits.some((c) => c.id === m.constituencies.dail![0].uri)
			);
		else if (selectedParties.length > 0)
			filtered = props.members.filter((m) =>
				selectedParties.some((c) => c.id === m.parties[0].uri)
			);

		setFilteredMembers(filtered);
	}, [selectedConstits, selectedParties]);

	const [menuDirection, setMenuDirection] = useState<'row' | 'column'>(
		() => 'column'
	);
	const [selectWidth, setSelectWidth] = useState<number>(() => 200);
	const { breakpoint } = useViewport();
	useEffect(() => {
		if (breakpoint === 'xs' || breakpoint === 'sm' || breakpoint === 'md') {
			setMenuDirection('row');
			if (breakpoint === 'xs') setSelectWidth(150);
			else if (breakpoint === 'sm') setSelectWidth(180);
		} else {
			setMenuDirection('column');
		}
	}, [breakpoint]);
	return (
		<>
			<Grid container>
				<Grid item xs={12} sm={12} md={12} lg={2} px={2}>
					<Box sx={{ mb: '20px' }}>
						<FormControl component='fieldset' variant='standard'>
							<FormLabel component='legend'>Filter By</FormLabel>
							<Stack direction={menuDirection}>
								<Stack>
									<MultipleSelect
										label={'Parties'}
										width={selectWidth}
										options={parties}
										setSelectedOptions={setSelectedParties}
									/>
								</Stack>
								<Stack>
									<MultipleSelect
										label={'Constituencies'}
										width={selectWidth}
										options={constits}
										setSelectedOptions={setSelectedConstits}
									/>
								</Stack>
							</Stack>
						</FormControl>
					</Box>
				</Grid>
				<Grid item xs={12} sm={12} md={12} lg={10} px={2}>
					<Box>
						<Grid
							container
							gap={1}
							justifyContent='space-evenly'
							alignItems='center'>
							{filteredMembers?.map((m) => {
								if (m.isActiveTD === false) return null;
								return (
									<Grid item xs={5.5} sm={2.8} md={2.1} lg={2.2} key={m.uri}>
										<TDcard member={m} />
									</Grid>
								);
							})}
						</Grid>
					</Box>
				</Grid>
			</Grid>
		</>
	);
}
