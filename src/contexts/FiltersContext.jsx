import { createContext } from 'react';

export const FiltersContext = createContext({
	filters: {
		patientName: '',
		startDate: '',
		endDate: '',
	},
	setFilters: () => {},
	saveViews: {},
	setSaveViews: () => {},
	selectedSaveView: '',
	setSelectedSaveView: () => {},
	page: 1,
	setPage: () => {},
	rowsPerPage: 10,
	setRowsPerPage: () => {},
});
