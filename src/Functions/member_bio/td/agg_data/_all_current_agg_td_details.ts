/** @format */
import houseDetails from '@/Data/house-details';
import getAggregatedTDsDetailsByHouse from './_agg_td_details_by_house';

async function getAllCurrentAggTDdetails() {
	return getAggregatedTDsDetailsByHouse(houseDetails.dail.current);
}

export default getAllCurrentAggTDdetails;
