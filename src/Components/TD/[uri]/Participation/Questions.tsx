/** @format */
import { useEffect, useState } from 'react';
import { Box, Typography, styled, Paper } from '@mui/material';
import { format } from 'date-fns';
import fetchQuestions from '@/functions/APIs/Oireachtas/question/_index';
import { capitaliseFirstLetters } from '@/functions/_utils/strings';
import { Question } from '@/models/oireachtas_api/question';

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A3027' : '#F0F4F8',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	minHeight: '100%',

	color: theme.palette.text.secondary,
}));

const formatAddressedTo = (minister: string) => {
	if (minister != 'Taoiseach' && minister != 'Tánaiste') {
		return `Minister for ${capitaliseFirstLetters(minister)}`;
	}
	if (minister == 'Taoiseach' || 'Tánaiste') {
		return `An ${capitaliseFirstLetters(minister)}`;
	}
};

export default function QuestionsComp(props: {
	member: string;
	selectedDate: Date;
}) {
	const [questions, setQuestions] = useState<Question[]>([]); // questions on date selected

	const handleCalendarChange = async () => {
		// fetches questions and sets them to selected date
		const date = format(props.selectedDate, 'yyyy-MM-dd');
		const questions: Question[] = await fetchQuestions({
			date_start: date,
			date_end: date,
			member_id: props.member,
		});
		setQuestions(questions);
	};

	useEffect(() => {
		// When user changes date, triggers fetching of questions
		{
			props.selectedDate !== null ? handleCalendarChange() : null;
		}
	}, [props.selectedDate]);

	return (
		<>
			{questions?.map((q, index) => {
				return (
					<Item key={index}>
						<Box padding={1}>
							<Typography variant='subtitle1' color='primary'>
								{capitaliseFirstLetters(q.type)} question to the{' '}
								{formatAddressedTo(q.addressedTo)}
							</Typography>

							<Typography variant='subtitle2'>{`RE: ${q.topic}`}</Typography>
							<br />
							<Typography variant='body1'>{q.content}</Typography>
						</Box>
					</Item>
				);
			})}
		</>
	);
}
