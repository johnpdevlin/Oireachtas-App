/** @format */
import 'bootstrap/dist/css/bootstrap.min.css';

import fetchMembers from '@/Functions/Fetcher/OireachtasAPI/members';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Head } from 'next/document';
import Link from 'next/link';
import { useRef, useState } from 'react';

import { Form, Button, Stack, Row, Col, Accordion } from 'react-bootstrap';
import AccordionItem from '@/UI-Components/Internal/AccordionItem';
import InterestsForm from '@/UI-Components/InterestsForm';
import { Interests } from '@/Models/Interests/interests';

type BasicMember = {
	fullName: string;
	uri: string;
};

export default function AddInterests(props: { members: any }): JSX.Element {
	const members: BasicMember = props.members.map(
		(m: { member: { fullName: string; memberCode: string } }) => {
			return { fullName: m.member.fullName, uri: m.member.memberCode };
		}
	);

	const [selectedMember, setSelectedMember] = useState<BasicMember | null>(
		null
	);

	const [relevantYear, setRelevantYear] = useState<Date | null>(null);
	const [dateRegistered, setDateRegistered] = useState<Date | null>(null);

	return (
		<>
			{/* <Head>
				<title>Input TD interests</title>
				<meta name='description' content={''} />
				<link rel='icon' href='/favicon.ico' />
			</Head> */}

			<InterestsForm
				member={selectedMember}
				relevantYear={relevantYear}
				dateRegistered={dateRegistered}
				handleSubmit={function (): void {
					throw new Error('Function not implemented.');
				}}
			/>

			{/* <Form onSubmit={handleSubmit}>
				<Stack gap={4} className='mb-3'>
					<Row>
						<Col>
							<Form.Group controlId='question'>
								<Form.Label>Question:</Form.Label>
								<Form.Control
									ref={questionRef}
									required
									defaultValue={question}
								/>
							</Form.Group>
						</Col>
						<Col>
							<Form.Group controlId='tags'>
								<Form.Label>Tags:</Form.Label>
								<CreatableReactSelect
									onCreateOption={(label) => {
										const newTag = { id: uuidV4(), label };
										onAddTag(newTag);
										setSelectedTags((prev) => [...prev, newTag]);
									}}
									value={selectedTags.map((tag) => {
										return { label: tag.label, value: tag.id };
									})}
									options={availableTags.map((tag) => {
										return { label: tag.label, value: tag.id };
									})}
									onChange={(tags) => {
										setSelectedTags(
											tags.map((tag) => {
												return { label: tag.label, id: tag.value };
											})
										);
									}}
									isMulti
								/>
							</Form.Group>
						</Col>
					</Row>
					<Form.Group controlId='answer'>
						<Form.Label>Answer:</Form.Label>
						<Form.Control
							defaultValue={answer}
							required
							ref={answerRef}
							as='textarea'
							rows={10}
						/>
					</Form.Group>
				</Stack>
				<Stack direction='horizontal' gap={2} className='justify-content-end'>
					<Link to='..'>
						<Button variant='outline-secondary' type='button'>
							Cancel
						</Button>
					</Link>
					<Button variant='primary' type='submit'>
						Save
					</Button>
				</Stack>
			</Form> */}
		</>
	);
}

export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: [], //indicates that no page needs be created at build time
		fallback: 'blocking', //indicates the type of fallback
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	let { dail_session } = params!;

	const members = await fetchMembers({
		house_no: dail_session,
		chamber_id: 'dail',
	});

	return {
		props: {
			members: members,
		},
		// revalidate: 43200, // 12 hours
	};
};
