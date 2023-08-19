/** @format */

import { Tooltip } from '@mui/material';

/** @format */
export default function HoverableFootnote(props: {
	name: string;
	text: string;
}): JSX.Element {
	return (
		<Tooltip title={props.text}>
			<small>{props.name}</small>
		</Tooltip>
	);
}
