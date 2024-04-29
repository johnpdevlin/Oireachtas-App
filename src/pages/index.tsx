/** @format */

export async function getServerSideProps() {
	// Perform the redirection
	return {
		redirect: {
			destination: '/td',
			permanent: true,
		},
	};
}

// This component won't be rendered as the page is redirected before rendering
export default function Index() {
	return null;
}
