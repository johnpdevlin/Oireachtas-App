/** @format */

import Image from 'next/image';
import Link from 'next/link';
export default function ProfileImage(props: {
	uri: string;
	name: string;
	size: number;
	borderRadius?: number;
}) {
	return (
		<>
			<Link href={`/td/${props.uri}`}>
				<Image
					src={`https://data.oireachtas.ie/ie/oireachtas/member/id/${props.uri}/image/large`}
					alt={props.name}
					placeholder='blur'
					blurDataURL={`https://data.oireachtas.ie/ie/oireachtas/member/id/${props.uri}/image/small`}
					height={props.size}
					width={props.size}
					style={{
						maxWidth: '100%',
						borderRadius: `${props.borderRadius?.toString()}px`,
						boxShadow: '0 0 0 1.2px rgba(0, 0, 0, 0.1)',
					}}
				/>
			</Link>
		</>
	);
}
