/** @format */

import Image from 'next/image';
export default function ProfileImage(props: {
	uri: string;
	name: string;
	size: number;
	borderRadius?: number;
}) {
	return (
		<>
			<Image
				src={`https://data.oireachtas.ie/ie/oireachtas/member/id/${props.uri}/image/large`}
				alt={props.name}
				placeholder='blur'
				blurDataURL={`https://data.oireachtas.ie/ie/oireachtas/member/id/${props.uri}/image/small`}
				height={props.size}
				width={props.size}
				style={{
					maxWidth: '100%',
					height: 'auto',
					borderRadius: `${props.borderRadius?.toString()}px`,
				}}
			/>
		</>
	);
}
