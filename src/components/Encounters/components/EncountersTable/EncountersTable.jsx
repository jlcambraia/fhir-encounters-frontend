import { useContext } from 'react';
import SkeletonLoading from './components/SkeletonLoading';
import { useTranslations } from '../../../../hooks/useTranslations';
import { EncountersContext } from '../../../../contexts/EncountersContext';
import { FiltersContext } from '../../../../contexts/FiltersContext';
import {
	formatName,
	formatDate,
	getStatusProps,
} from '../../../../utils/formatters';
import './EncountersTable.css';

const EncountersTable = ({ paginatedEncounters, setSelected }) => {
	// ============================================
	// HOOKS E CONTEXTOS
	// ============================================
	const { translate, language } = useTranslations();
	const { patients, practitioners, loading } = useContext(EncountersContext);
	const { rowsPerPage } = useContext(FiltersContext);

	// ============================================
	// FUNÇÃO PARA EXTRAIR DADOS DO ENCOUNTER
	// ============================================
	const getEncounterData = (enc) => {
		const patientId = enc.subject?.reference?.split('/')[1];
		const practitionerId = enc.participant
			?.find((p) => p.individual)
			?.individual?.reference?.split('/')[1];

		const patient = patients[patientId];
		const practitioner = practitioners[practitionerId];

		return {
			patient,
			practitioner,
			patientName: patient
				? formatName(patient.name, translate)
				: translate('notAvailable'),
			practitionerName: practitioner
				? formatName(practitioner.name, translate)
				: translate('notAvailable'),
			formattedDate: formatDate(enc.period?.start, translate, language),
			statusProps: getStatusProps(enc.status, translate),
		};
	};

	// ============================================
	// FUNÇÃO PARA RENDERIZAR LINHA DA TABELA
	// ============================================
	const renderEncounterRow = (enc) => {
		const encounterData = getEncounterData(enc);

		return (
			<tr
				key={enc.id}
				className='table__row'
				onClick={() => setSelected(enc)}
				tabIndex={0}
				aria-label={`${translate('detailsTitle')} ${enc.id}`}
			>
				<td className='table__cell table__cell_id'>
					<a href='#' className='table__link'>
						{enc.id}
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
	// RENDERIZAÇÃO PRINCIPAL
	// ============================================
	return (
		<table className='table'>
			{/* Cabeçalho da Tabela */}
			<thead className='table__thead'>
				<tr>
					<th className='table__th'>{translate('encounterID')}</th>
					<th className='table__th'>{translate('patientName')}</th>
					<th className='table__th'>{translate('practitioner')}</th>
					<th className='table__th'>{translate('appointmentDate')}</th>
					<th className='table__th'>{translate('status')}</th>
				</tr>
			</thead>

			{/* Corpo da Tabela */}
			<tbody>
				{loading
					? [...Array(rowsPerPage)].map((_, i) => <SkeletonLoading key={i} />)
					: paginatedEncounters.map(renderEncounterRow)}
			</tbody>
		</table>
	);
};

export default EncountersTable;
