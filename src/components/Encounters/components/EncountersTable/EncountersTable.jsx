import { useContext } from 'react';
import SkeletonLoading from './components/SkeletonLoading';
import { useTranslations } from '../../../../hooks/useTranslations';
import { EncountersContext } from '../../../../contexts/EncountersContext';
import { FiltersContext } from '../../../../contexts/FiltersContext';
import { getEncounterDetails } from '../../../../utils/formatters'; // Importação da nova função
import './EncountersTable.css';

const EncountersTable = ({ paginatedEncounters, setSelected }) => {
	// ============================================
	// HOOKS E CONTEXTOS
	// ============================================
	const { translate, language } = useTranslations();
	const { patients, practitioners, loading } = useContext(EncountersContext);
	const { rowsPerPage } = useContext(FiltersContext);

	// ============================================
	// FUNÇÃO PARA RENDERIZAR LINHA DA TABELA
	// ============================================
	const renderEncounterRow = (enc) => {
		const encounterData = getEncounterDetails(
			enc,
			patients,
			practitioners,
			translate,
			language
		);

		return (
			<tr
				key={enc.id}
				className='table__row'
				onClick={() => setSelected(enc)}
				tabIndex={0}
				aria-label={`${translate('detailsTitle')} ${enc.id}`}
			>
				<td className='table__cell table__cell_id'>
					<a
						href='#'
						className='table__link'
						onClick={(e) => e.preventDefault()}
					>
						{encounterData.id}
					</a>
				</td>

				<td className='table__cell table__cell_patient'>
					<div className='table__patient-info'>
						<p>{encounterData.patientName}</p>
					</div>
				</td>

				<td className='table__cell table__cell_practitioner'>
					<p>{encounterData.practitionerName}</p>
				</td>

				<td className='table__cell'>{encounterData.formattedDate}</td>

				<td className='table__cell'>
					<span className={encounterData.statusProps.className}>
						{encounterData.statusProps.text}
					</span>
				</td>
			</tr>
		);
	};

	// ============================================
	// FUNÇÃO PARA RENDERIZAR ESTADO VAZIO
	// ============================================
	const renderEmptyState = () => {
		return (
			<tr>
				<td colSpan={5} className='table__cell table__cell_empty'>
					<div className='table__empty-message'>
						<p>{translate('noEncountersFound')}</p>
					</div>
				</td>
			</tr>
		);
	};

	// ============================================
	// RENDERIZAÇÃO PRINCIPAL
	// ============================================
	return (
		<div className='table-container'>
			<table className='table'>
				<thead className='table__thead'>
					<tr>
						<th className='table__th'>{translate('encounterID')}</th>
						<th className='table__th'>{translate('patientName')}</th>
						<th className='table__th'>{translate('practitioner')}</th>
						<th className='table__th'>{translate('appointmentDate')}</th>
						<th className='table__th'>{translate('status')}</th>
					</tr>
				</thead>

				<tbody>
					{loading
						? [...Array(rowsPerPage)].map((_, i) => (
								<SkeletonLoading key={`skeleton-${i}`} />
						  ))
						: paginatedEncounters && paginatedEncounters.length > 0
						? paginatedEncounters.map(renderEncounterRow)
						: renderEmptyState()}
				</tbody>
			</table>
		</div>
	);
};

export default EncountersTable;
