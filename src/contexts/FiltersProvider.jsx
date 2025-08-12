import { useState } from 'react';
import { FiltersContext } from './FiltersContext';

export function FiltersProvider({ children }) {
	const [filters, setFilters] = useState({
		patientName: '',
		startDate: '',
		endDate: '',
	});
	const [selectedSaveView, setSelectedSaveView] = useState('');
	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	// Função que resgata os Save Views do localStorage
	const [saveViews, setSaveViews] = useState(() => {
		return JSON.parse(localStorage.getItem('saveViews')) || {};
	});

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
