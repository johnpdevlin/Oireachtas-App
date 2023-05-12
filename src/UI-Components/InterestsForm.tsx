/** @format */

import { Form, Stack, Row, Button, FloatingLabel } from 'react-bootstrap';

import { useRef } from 'react';

function InterestsForm(props: { submitInterests: () => void }): JSX.Element {
	const propertyRef = useRef<HTMLTextAreaElement>(null);
	const sharesRef = useRef<HTMLTextAreaElement>(null);
	const directorshipsRef = useRef<HTMLTextAreaElement>(null);
	const servicesSuppliedRef = useRef<HTMLTextAreaElement>(null);
	const contractsRef = useRef<HTMLTextAreaElement>(null);
	const travelRef = useRef<HTMLTextAreaElement>(null);
	const giftsRef = useRef<HTMLTextAreaElement>(null);
	const occupationsRef = useRef<HTMLTextAreaElement>(null);
	const remuneratedPositionsRef = useRef<HTMLTextAreaElement>(null);

	const handleSubmit = () => {
		const interests = {
			property: propertyRef.current?.value,
			shares: sharesRef.current?.value,
			directorships: directorshipsRef.current?.value,
			servicesSupplied: servicesSuppliedRef.current?.value,
			contracts: contractsRef.current?.value,
			travel: travelRef.current?.value,
			gifts: giftsRef.current?.value,
			occupations: occupationsRef.current?.value,
			remuneratedPositions: remuneratedPositionsRef.current?.value,
		};
		props.submitInterests(interests);
	};

	const interestsArray = [
		{ id: 'property', title: 'Property Etc.', ref: propertyRef },
		{ id: 'shares', title: 'Shares Etc', ref: sharesRef },
		{ id: 'directorships', title: 'Directorships', ref: directorshipsRef },
		{
			id: 'servicesSupplied',
			title: 'Property supplied or lent or a Service supplied',
			ref: servicesSuppliedRef,
		},
		{ id: 'contracts', title: 'Contracts', ref: contractsRef },
		{ id: 'travel', title: 'Travel Facilities', ref: travelRef },
		{ id: 'gifts', title: 'Gifts', ref: giftsRef },
		{ id: 'occupations', title: 'Occupations', ref: occupationsRef },
		{
			id: 'remuneratedPositions',
			title: 'Renumerated Positions',
			ref: remuneratedPositionsRef,
		},
	];

	return (
		<>
			<Form onSubmit={handleSubmit}>
				<Stack gap={4} className='mb-3'>
					{interestsArray.map((interest) => (
						<>
							<Row>
								<Form.Label>
									{interest.title}
									<Form.Control
										key={interest.id}
										id={`${interest.id}.details`}
										ref={interest.ref}
										as='textarea'
										placeholder='Details'
										style={{ height: '50px', width: '', marginBottom: '10px' }}
									/>
								</Form.Label>
							</Row>
						</>
					))}
				</Stack>
				<Stack direction='horizontal' gap={2} className='justify-content-end'>
					<Button variant='primary' type='submit'>
						Save
					</Button>
				</Stack>
			</Form>
		</>
	);
}

export default InterestsForm;
