import { useState, useContext } from 'react';
import { FiltersContext } from '../contexts/FiltersContext';
import { useTranslations } from './useTranslations';

export function useFilters() {
	const [isSaveViewModalOpen, setIsSaveViewModalOpen] = useState(false);
	const { language } = useTranslations();
	const {
		filters,
		setFilters,
		saveViews,
		setSaveViews,
		selectedSaveView,
		setSelectedSaveView,
		setPage,
	} = useContext(FiltersContext);

	// Converte data do formato ISO para DD/MM/YYYY ou MM/DD/YYYY
	const formatDateForDisplay = (isoDate) => {
		if (!isoDate) return '';

		const date = new Date(isoDate + 'T00:00:00'); // Garante timezone local
		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear();

		if (language === 'pt') {
			return `${day}/${month}/${year}`;
		} else {
			return `${month}/${day}/${year}`;
		}
	};

	// Converte data de DD/MM/YYYY ou MM/DD/YYYY para formato ISO
	const parseDateFromDisplay = (displayDate) => {
		if (!displayDate) return '';

		const parts = displayDate.split('/');
		if (parts.length !== 3) return '';

		let day, month, year;

		if (language === 'pt') {
			// DD/MM/YYYY
			day = parts[0];
			month = parts[1];
			year = parts[2];
		} else {
			// MM/DD/YYYY
			month = parts[0];
			day = parts[1];
			year = parts[2];
		}

		// Valida se são números válidos
		const dayNum = parseInt(day, 10);
		const monthNum = parseInt(month, 10);
		const yearNum = parseInt(year, 10);

		if (
			isNaN(dayNum) ||
			isNaN(monthNum) ||
			isNaN(yearNum) ||
			dayNum < 1 ||
			dayNum > 31 ||
			monthNum < 1 ||
			monthNum > 12
		) {
			return '';
		}

		// Retorna no formato ISO (YYYY-MM-DD)
		return `${yearNum}-${monthNum.toString().padStart(2, '0')}-${dayNum
			.toString()
			.padStart(2, '0')}`;
	};

	// Cria range de datas incluindo início e fim
	const createDateRange = (startDate, endDate) => {
		if (!startDate && !endDate) return null;

		const range = {};

		if (startDate) {
			// Início do dia (00:00:00)
			const start = new Date(startDate + 'T00:00:00');
			range.start = start;
		}

		if (endDate) {
			// Final do dia (23:59:59.999)
			const end = new Date(endDate + 'T23:59:59.999');
			range.end = end;
		}

		return range;
	};

	// Verifica se uma data está dentro do range
	const isDateInRange = (dateToCheck, dateRange) => {
		if (!dateRange) return true;

		const checkDate = new Date(dateToCheck);

		if (dateRange.start && checkDate < dateRange.start) {
			return false;
		}

		if (dateRange.end && checkDate > dateRange.end) {
			return false;
		}

		return true;
	};

	// Mantém datas em ISO no estado para inputs do tipo date funcionarem corretamente
	const handleFilterChange = (e) => {
		setFilters((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	// Função para lidar com inputs de data customizados
	const handleCustomDateChange = (e) => {
		const { name, value } = e.target;

		// Remove caracteres não numéricos e barras
		let cleanValue = value.replace(/[^\d/]/g, '');

		// Aplica máscara conforme o idioma
		if (cleanValue.length <= 10) {
			// Adiciona barras automaticamente
			if (cleanValue.length >= 3 && cleanValue[2] !== '/') {
				cleanValue = cleanValue.slice(0, 2) + '/' + cleanValue.slice(2);
			}
			if (cleanValue.length >= 6 && cleanValue[5] !== '/') {
				cleanValue = cleanValue.slice(0, 5) + '/' + cleanValue.slice(5);
			}
		}

		// Converte para ISO se a data estiver completa
		let isoDate = '';
		if (cleanValue.length === 10) {
			isoDate = parseDateFromDisplay(cleanValue);
		}

		// Atualiza o estado com a data ISO
		setFilters((prev) => ({
			...prev,
			[name]: isoDate,
		}));
	};

	const handleClearFilters = () => {
		setFilters({ patientName: '', startDate: '', endDate: '' });
		setSelectedSaveView('');
		setPage(1);
	};

	const handleSaveView = () => {
		setIsSaveViewModalOpen(true);
	};

	const handleSaveViewConfirm = (viewName) => {
		const newSaveViews = { ...saveViews, [viewName]: filters };
		setSaveViews(newSaveViews);
		localStorage.setItem('saveViews', JSON.stringify(newSaveViews));
		setSelectedSaveView(viewName);
	};

	const handleCloseSaveViewModal = () => {
		setIsSaveViewModalOpen(false);
	};

	const handleSelectSaveView = (e) => {
		const name = e.target.value;
		setSelectedSaveView(name);

		if (name && saveViews[name]) {
			setFilters(saveViews[name]);
			setPage(1);
		}
	};

	const handleFormSubmit = (e) => {
		e.preventDefault();
		setPage(1);
	};

	const handleFormReset = (e) => {
		e.preventDefault();
		handleClearFilters();
	};

	// Função para ser usada na filtragem dos dados
	const applyDateFilter = (data) => {
		if (!filters.startDate && !filters.endDate) {
			return data;
		}

		const dateRange = createDateRange(filters.startDate, filters.endDate);

		return data.filter((item) => {
			// Assumindo que o item tem uma propriedade 'date' ou similar
			// Ajuste conforme a estrutura dos seus dados
			const itemDate = item.date || item.createdAt || item.appointmentDate;
			if (!itemDate) return true;

			return isDateInRange(itemDate, dateRange);
		});
	};

	// Formata a data para exibição amigável conforme idioma
	const formatFilterDateToDisplay = (dateStr) => {
		return formatDateForDisplay(dateStr);
	};

	return {
		isSaveViewModalOpen,
		filters,
		saveViews,
		selectedSaveView,
		handleFilterChange,
		handleCustomDateChange,
		handleClearFilters,
		handleSaveView,
		handleSaveViewConfirm,
		handleCloseSaveViewModal,
		handleSelectSaveView,
		handleFormSubmit,
		handleFormReset,
		formatFilterDateToDisplay,
		formatDateForDisplay,
		parseDateFromDisplay,
		createDateRange,
		isDateInRange,
		applyDateFilter,
	};
}
