/** @format */

import TDlayout from '@/Components/TD/Layouts/[uri]';
import Layout from '@/Components/_layout';
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
