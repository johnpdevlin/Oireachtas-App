/** @format */

import TDlayout from '@/Components/TD/Layouts/[uri]/_index';
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
