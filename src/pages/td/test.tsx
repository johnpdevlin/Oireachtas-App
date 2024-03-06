/** @format */

import TDlayout from '@/UI-Components/TD/Layouts/[uri]';
import Layout from '@/UI-Components/_layout';
import member from '@/Data/sample/memberBio';

export default function TeachtaDála() {
	return (
		<>
			<Layout>
				<TDlayout member={member} />
			</Layout>
		</>
	);
}
