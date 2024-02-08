/** @format */

type DateRange = {
	start_date: Date;
	end_date: Date;
};

export type SittingDays = {
	name?: string;
	uri?: string;
	dateRange: DateRange;
	limit: number;
	totalPossibleSittings: number;
	sittingDates: (string | undefined)[];
	otherDates: (string | undefined)[];
	sittingTotal: number;
	otherTotal: number;
	total: number;
	percentage: number;
};

export type SittingDaysRecord = {
	url: string;
	year: number;
} & SittingDays;
