import { useContext, useMemo } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { FiltersContext } from '../../contexts/FiltersContext';
import { EncountersContext } from '../../contexts/EncountersContext';
import { formatName } from '../../utils/formatters';
import EncountersTable from './components/EncountersTable/EncountersTable';
import Pagination from './components/Pagination/Pagination';
import tableIcon from '../../assets/icons/table-icon.png';
import './Encounters.css';

const Encounters = ({ setSelected }) => {
	const { translate } = useTranslations();
	const { page, rowsPerPage, filters } = useContext(FiltersContext);
	const { encounters, patients } = useContext(EncountersContext);

	const filteredEncounters = useMemo(() => {
		return encounters.filter((enc) => {
			// ============================================
			// FILTRO POR NOME DO PACIENTE
			// ============================================
			const patientId = enc.subject?.reference?.split('/')[1];
			const patient = patients[patientId];
			const patientName = patient
				? formatName(patient.name, translate).toLowerCase()
				: '';

			if (
				filters.patientName &&
				!patientName.includes(filters.patientName.toLowerCase())
			) {
				return false;
			}

			// ============================================
			// FILTRO POR DATA (COMPARANDO APENAS DATAS)
			// ============================================
			if (!enc.period?.start) return false; // Se não tem data, não exibir

			// Pegar apenas a parte da data (YYYY-MM-DD) ignorando horário
			const encDateOnly = enc.period.start.split('T')[0];

			// Filtro de data inicial (>= data inicial)
			if (filters.startDate && encDateOnly < filters.startDate) {
				return false;
			}

			// Filtro de data final (CORRIGIDO: <= data final)
			if (filters.endDate && encDateOnly > filters.endDate) {
				return false;
			}

			return true;
		});
	}, [encounters, patients, filters, translate]);

	const totalResults = filteredEncounters.length;
	const totalPages = Math.ceil(totalResults / rowsPerPage);
	const paginatedEncounters = filteredEncounters.slice(
		(page - 1) * rowsPerPage,
		page * rowsPerPage
	);

	return (
		<section className='encounters'>
			<div className='encounters__header'>
				<div className='encounters__title-container'>
					<img
						className='encounters__icon'
						src={tableIcon}
						alt='Icon of a table'
					/>
					<h2 className='encounters__title'>{translate('title')}</h2>
				</div>

				<span className='encounters__results'>
					{translate('showingResults')} {(page - 1) * rowsPerPage + 1}-
					{Math.min(page * rowsPerPage, totalResults)} {translate('of')}{' '}
					{totalResults} {translate('results')}
				</span>
			</div>

			<EncountersTable
				paginatedEncounters={paginatedEncounters}
				setSelected={setSelected}
			/>

			<Pagination totalPages={totalPages} />
		</section>
	);
};

export default Encounters;
