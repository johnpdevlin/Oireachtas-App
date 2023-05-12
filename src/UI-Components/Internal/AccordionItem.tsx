/** @format */

import { Accordion } from 'react-bootstrap';

function AccordionItem(props: {
	key: string;
	title: string;
	children: JSX.Element;
}): JSX.Element {
	return (
		<>
			<Accordion.Item eventKey={props.key}>
				<Accordion.Header>{props.title}</Accordion.Header>
				<Accordion.Body>{props.children}</Accordion.Body>
			</Accordion.Item>
		</>
	);
}

export default AccordionItem;
