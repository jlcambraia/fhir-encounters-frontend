import { useState } from 'react';
import { FiltersContext } from './FiltersContext';

export function FiltersProvider({ children }) {
	const [filters, setFilters] = useState({
		patientName: '',
		startDate: '',
		endDate: '',
	});

	const [saveViews, setSaveViews] = useState(() => {
		return JSON.parse(localStorage.getItem('saveViews')) || {};
	});

	const [selectedSaveView, setSelectedSaveView] = useState('');
	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	return (
		<FiltersContext.Provider
			value={{
				filters,
				setFilters,
				saveViews,
				setSaveViews,
				selectedSaveView,
				setSelectedSaveView,
				page,
				setPage,
				rowsPerPage,
				setRowsPerPage,
			}}
		>
			{children}
		</FiltersContext.Provider>
	);
}
