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

	// Usa useMemo para memorizar o array de encontros filtrados.
	// Isso evita que a filtragem seja refeita a cada renderização,
	// sendo recalculada apenas quando `encounters`, `patients` ou `filters` mudarem.
	const filteredEncounters = useMemo(() => {
		return encounters.filter((enc) => {
			// Extrai o ID do paciente do encontro.
			const patientId = enc.subject?.reference?.split('/')[1];
			// Busca o objeto completo do paciente.
			const patient = patients[patientId];
			// Formata o nome do paciente e o converte para minúsculas para a busca.
			const patientName = patient
				? formatName(patient.name, translate).toLowerCase()
				: '';

			// Verifica o filtro de nome do paciente. Se o nome não incluir o texto do filtro, retorna `false`.
			if (
				filters.patientName &&
				!patientName.includes(filters.patientName.toLowerCase())
			) {
				return false;
			}

			// Se o encontro não tiver data, ele não deve ser exibido.
			if (!enc.period?.start) return false;

			// Extrai apenas a parte da data (YYYY-MM-DD) da string completa para a filtragem.
			const encDateOnly = enc.period.start.split('T')[0];

			// Filtro de data inicial: se a data do encontro for anterior à data inicial do filtro, retorna `false`.
			if (filters.startDate && encDateOnly < filters.startDate) {
				return false;
			}

			// Filtro de data final: se a data do encontro for posterior à data final do filtro, retorna `false`.
			if (filters.endDate && encDateOnly > filters.endDate) {
				return false;
			}

			// Se todas as condições de filtro passarem, o encontro é incluído.
			return true;
		});
	}, [encounters, patients, filters, translate]);

	// Calcula o total de resultados após a filtragem.
	const totalResults = filteredEncounters.length;
	// Calcula o número total de páginas.
	const totalPages = Math.ceil(totalResults / rowsPerPage);
	// Usa o `slice` para paginar os encontros filtrados, exibindo apenas os da página atual.
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
