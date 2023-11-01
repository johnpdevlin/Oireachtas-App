/** @format */
import { Box, FormControl, FormLabel, Grid, Stack } from '@mui/material';
import Header from '@/UI-Components/Header';
import MultipleSelect from '@/UI-Components/_utils/Select/MultiSelect';
import { memo, useEffect, useState } from 'react';
import { PartyAPI } from '@/models/oireachtasApi/party';
import { ConstituencyAPI } from '@/models/oireachtasApi/constituency';
import { MemberAPIdetails } from '@/models/oireachtasApi/Formatted/Member/member';
import TDcard from '../_utils/TDcard';
import { useViewport } from '@/hooks/viewportProvider';
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
		let filtered = props.members;
		if (selectedConstits.length > 0)
			filtered = filtered.filter((m) =>
				selectedConstits.some((c) => c.id === m.constituencies.dail![0].uri)
			);
		if (selectedParties.length > 0) console.log(selectedParties);
		filtered = filtered.filter((m) =>
			selectedParties.some((c) => c.id === m.parties[0].uri)
		);
		if (selectedParties.length === 0 && selectedConstits.length === 0) {
			filtered = props.members;
		}

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
			<Header />
			<Grid container>
				<Grid item xs={12} sm={12} md={12} lg={2.5}>
					<Box sx={{ ml: '10px', mb: '20px' }}>
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
				<Grid item xs={12} sm={12} md={12} lg={9.5}>
					<Box sx={{ mr: '10px' }}>
						<Grid
							container
							gap={2}
							justifyContent='space-evenly'
							alignItems='center'>
							{filteredMembers?.map((m) => {
								if (m.isActiveTD === false) return null;
								return (
									<Grid item xs={3.5} sm={2.8} md={2.1} lg={2.2} key={m.uri}>
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
