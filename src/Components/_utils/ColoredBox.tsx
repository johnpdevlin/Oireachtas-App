/** @format */

type BoxProps = { color: string; size: string; margin?: string };

function ColoredBox({ color, size, margin }: BoxProps) {
	const boxStyle = {
		backgroundColor: color,
		width: size,
		height: size,
		margin: margin ?? '10px', // Adjust margin as needed
	};

	return <div style={boxStyle}></div>;
}

export default ColoredBox;
