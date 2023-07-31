/** @format */

import { membership } from '../../../../Models/UI/member';
import { processMembershipType } from './Functions';

// REFORMATS PARTY OBJECTS
export default function processConstituencies(constituencies: any[]): {
	current: membership[];
	past: membership[];
} {
	return processMembershipType(constituencies, 'constituency');
}
