/** @format */
import { useEffect, useState } from 'react';
// UI COMPONENTS // MUI
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Pagination from '@mui/material/Pagination';
import Divider from '@mui/material/Divider';
import { Stack, Chip, Typography, Box } from '@mui/material';

// INTERNAL TOOLS
import { Question } from '../../Models/UI/participation';
import fetchQuestions from '../../Fetcher/OireachtasAPI/questions';
import { format } from 'date-fns';
import formatAddressedTo from '../../Components/Tools/Styling/AddressedTo';
import CapitaliseFirstLetter from '../../Components/Tools/Styling/CapitaliseFirstLetter';

export default function TdQuestions(props: {
	member: string;
	selectedDate: Date;
}) {
	const [questions, setQuestions] = useState<Question[]>([]); // questions on date selected

	const handleCalendarChange = async () => {
		// fetches questions and sets them to selected date
		const date = format(props.selectedDate, 'yyyy-MM-dd');
		const questions: Question[] = await fetchQuestions({
			date: date,
			member: props.member,
		});
		setQuestions(questions);
	};

	useEffect(() => {
		// When user changes date, triggers fetching of questions
		{
			props.selectedDate !== null ? handleCalendarChange() : null;
		}
	}, [props.selectedDate]);

	const pageCount = () => {
		// calculate the number of pages needed to paginate
		const pc: number = Math.ceil(questions.length / 5);
		return pc;
	};
	const pages: any[][] = [];

	return (
		<>
			<Box>
				<ul>
					{questions?.map((q, index) => {
						return (
							<li key={index}>
								<h5>
									{' '}
									{CapitaliseFirstLetter(q.type)} question to the{' '}
									{formatAddressedTo(q.addressedTo)}
									<br />
									{`RE: ${q.topic}`}
								</h5>

								<p>{q.content}</p>
								<Divider />
							</li>
						);
					})}
				</ul>
			</Box>
		</>
	);
}
