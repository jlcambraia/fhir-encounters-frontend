import { useContext, useEffect, useCallback } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { EncountersContext } from '../../contexts/EncountersContext';
import {
	formatDate,
	formatDateDetails,
	formatName,
	getStatusProps,
} from '../../utils/formatters';
import encounterDetailsIcon from '../../assets/icons/encounter-icon.png';
import encounterInformationIcon from '../../assets/icons/details-icon.png';
import patientIcon from '../../assets/icons/patient-icon.png';
import practitionertIcon from '../../assets/icons/practitioner-icon.png';
import additionalInformationIcon from '../../assets/icons/additional-information-icon.png';
import warningIcon from '../../assets/icons/warning-icon.png';
import './DetailsModal.css';

const DetailsModal = ({ selected, setSelected }) => {
	// ============================================
	// HOOKS E CONTEXTOS
	// ============================================
	const { translate, language } = useTranslations();
	const { patients, practitioners } = useContext(EncountersContext);

	// ============================================
	// FUNÇÃO PARA EXTRAIR DADOS DO PACIENTE
	// ============================================
	const getPatientData = () => {
		const patientId = selected.subject?.reference?.split('/')[1];
		const patient = patients[patientId];

		if (!patient) {
			return {
				name: translate('notAvailable'),
				id: translate('notAvailable'),
				birthDate: translate('notAvailable'),
				gender: translate('notAvailable'),
				contact: translate('notAvailable'),
				address: translate('notAvailable'),
			};
		}

		return {
			name: formatName(patient.name, translate),
			id: patient.id || translate('notAvailable'),
			birthDate: patient.birthDate
				? formatDate(patient.birthDate, translate, language)
				: translate('notAvailable'),
			gender: patient.gender
				? translate(patient.gender)
				: translate('notAvailable'),

			contact: patient.telecom?.[0]?.value || translate('notAvailable'),
			address: patient.address?.[0]
				? `${patient.address[0].line?.[0] || ''} ${
						patient.address[0].city || ''
				  }, ${patient.address[0].state || ''} ${
						patient.address[0].postalCode || ''
				  }`.trim()
				: translate('notAvailable'),
		};
	};

	// ============================================
	// FUNÇÃO PARA EXTRAIR DADOS DO MÉDICO
	// ============================================
	const getPractitionerData = () => {
		const practitionerId = selected.participant
			?.find((p) => p.individual)
			?.individual?.reference?.split('/')[1];
		const practitioner = practitioners[practitionerId];

		if (!practitioner) {
			return {
				name: translate('notAvailable'),
				id: translate('notAvailable'),
				specialty: translate('notAvailable'),
				phone: translate('notAvailable'),
				email: translate('notAvailable'),
				department: translate('notAvailable'),
			};
		}

		return {
			name: formatName(practitioner.name, translate),
			id: practitioner.id || translate('notAvailable'),
			specialty:
				practitioner.qualification?.[0]?.code?.text ||
				translate('notAvailable'),
			phone:
				practitioner.telecom?.find((t) => t.system === 'phone')?.value ||
				translate('notAvailable'),
			email:
				practitioner.telecom?.find((t) => t.system === 'email')?.value ||
				translate('notAvailable'),
			department:
				practitioner.qualification?.[0]?.issuer?.display ||
				translate('notAvailable'),
		};
	};

	// ============================================
	// FUNÇÕES DE MANIPULAÇÃO DO MODAL
	// ============================================
	const handleBackdropClick = (e) => {
		if (e.target === e.currentTarget) {
			setSelected(null);
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Escape') {
			setSelected(null);
		}
	};

	const handleClose = useCallback(() => {
		setSelected(null);
	}, [setSelected]);

	useEffect(() => {
		const handleEsc = (e) => {
			if (e.key === 'Escape') {
				if (document.activeElement) {
					document.activeElement.blur();
				}
				handleClose();
			}
		};

		if (selected) {
			document.addEventListener('keydown', handleEsc);
			return () => document.removeEventListener('keydown', handleEsc);
		}
	}, [selected, handleClose]);

	// ============================================
	// DADOS EXTRAÍDOS
	// ============================================
	const patientData = getPatientData();
	const practitionerData = getPractitionerData();
	const statusProps = getStatusProps(selected.status, translate);

	// ============================================
	// RENDERIZAÇÃO PRINCIPAL
	// ============================================
	return (
		<div
			className='details-modal'
			onClick={handleBackdropClick}
			onKeyDown={handleKeyDown}
		>
			<div className='details-modal__content'>
				{/* Cabeçalho */}
				<div className='details-modal__header'>
					<div className='details-modal__title-container'>
						<img
							className='details-modal__icon'
							src={encounterDetailsIcon}
							alt='Encounter Details icon'
						/>
						<h2 className='details-modal__title'>
							{translate('encounterDetails')}
						</h2>
					</div>
					<p className='details-modal__subtitle'>
						{translate('completeInformationForEncounter')}
					</p>
					<button
						className='details-modal__close-btn'
						onClick={handleClose}
						aria-label={translate('close')}
					>
						×
					</button>
				</div>

				<div className='details-modal__body'>
					{/* Informações do Encounter */}
					<section className='details-modal__section'>
						<h3 className='details-modal__section-title'>
							<img
								className='details-modal__section-icon'
								src={encounterInformationIcon}
								alt='Encounter Information Details icon'
							/>
							{translate('encounterInformation')}
						</h3>
						<div className='details-modal__info-grid'>
							<div className='details-modal__info-item'>
								<span className='details-modal__label'>
									{translate('encounterID')}:
								</span>
								<span className='details-modal__value'>{selected.id}</span>
							</div>
							<div className='details-modal__info-item'>
								<span className='details-modal__label'>
									{translate('dateTime')}:
								</span>
								<span className='details-modal__value'>
									{formatDateDetails(
										selected.period?.start,
										translate,
										language
									)}
								</span>
							</div>
							<div className='details-modal__info-item'>
								<span className='details-modal__label'>
									{translate('status')}:
								</span>
								<span
									className={`details-modal__status ${statusProps.className}`}
								>
									{statusProps.text}
								</span>
							</div>
							<div className='details-modal__info-item'>
								<span className='details-modal__label'>
									{translate('encounterType')}:
								</span>
								<span className='details-modal__value'>
									{selected.type?.[0]?.text || translate('outpatientVisit')}
								</span>
							</div>
							<div className='details-modal__info-item'>
								<span className='details-modal__label'>
									{translate('location')}:
								</span>
								<span className='details-modal__value'>
									{selected.location?.[0]?.location?.display ||
										translate('mainBuilding')}
								</span>
							</div>
						</div>
					</section>

					{/* Informações do Paciente */}
					<section className='details-modal__section'>
						<h3 className='details-modal__section-title'>
							<img
								className='details-modal__section-icon'
								src={patientIcon}
								alt='Patient Details icon'
							/>
							{translate('patientInformation')}
						</h3>
						<div className='details-modal__patient-header'>
							<div className='details-modal__patient-avatar'>
								{patientData.name.charAt(0).toUpperCase()}
							</div>
							<div className='details-modal__patient-basic'>
								<h4 className='details-modal__patient-name'>
									{patientData.name}
								</h4>
								<p className='details-modal__patient-id'>
									{translate('patientID')}: {patientData.id}
								</p>
							</div>
						</div>
						<div className='details-modal__info-grid'>
							<div className='details-modal__info-item'>
								<span className='details-modal__label'>
									{translate('dateOfBirth')}:
								</span>
								<span className='details-modal__value'>
									{patientData.birthDate}
								</span>
							</div>
							<div className='details-modal__info-item'>
								<span className='details-modal__label'>
									{translate('gender')}:
								</span>
								<span className='details-modal__value'>
									{patientData.gender}
								</span>
							</div>
							<div className='details-modal__info-item'>
								<span className='details-modal__label'>
									{translate('contact')}:
								</span>
								<span className='details-modal__value'>
									{patientData.contact}
								</span>
							</div>
							<div className='details-modal__info-item'>
								<span className='details-modal__label'>
									{translate('address')}:
								</span>
								<span className='details-modal__value'>
									{patientData.address}
								</span>
							</div>
						</div>
					</section>

					{/* Informações do Médico */}
					<section className='details-modal__section'>
						<h3 className='details-modal__section-title'>
							<img
								className='details-modal__section-icon'
								src={practitionertIcon}
								alt='Practitioner Details icon'
							/>
							{translate('practitionerInformation')}
						</h3>
						<div className='details-modal__practitioner-header'>
							<div className='details-modal__practitioner-avatar'>
								{practitionerData.name.charAt(0).toUpperCase()}
							</div>
							<div className='details-modal__practitioner-basic'>
								<h4 className='details-modal__practitioner-name'>
									{practitionerData.name}
								</h4>
								<p className='details-modal__practitioner-id'>
									{translate('practitionerID')}: {practitionerData.id}
								</p>
							</div>
						</div>
						<div className='details-modal__info-grid'>
							<div className='details-modal__info-item'>
								<span className='details-modal__label'>
									{translate('specialty')}:
								</span>
								<span className='details-modal__value'>
									{practitionerData.specialty}
								</span>
							</div>
							<div className='details-modal__info-item'>
								<span className='details-modal__label'>
									{translate('phone')}:
								</span>
								<span className='details-modal__value'>
									{practitionerData.phone}
								</span>
							</div>
							<div className='details-modal__info-item'>
								<span className='details-modal__label'>
									{translate('email')}:
								</span>
								<span className='details-modal__value'>
									{practitionerData.email}
								</span>
							</div>
							<div className='details-modal__info-item'>
								<span className='details-modal__label'>
									{translate('department')}:
								</span>
								<span className='details-modal__value'>
									{practitionerData.department}
								</span>
							</div>
						</div>
					</section>

					{/* Informações Adicionais */}
					<section className='details-modal__section'>
						<h3 className='details-modal__section-title'>
							<img
								className='details-modal__section-icon'
								src={additionalInformationIcon}
								alt='Additional Information icon'
							/>
							{translate('additionalInformation')}
						</h3>
						<div className='details-modal__info-grid'>
							<div className='details-modal__info-item'>
								<span className='details-modal__label'>
									{translate('reasonForVisit')}:
								</span>
								<span className='details-modal__value'>
									{selected.reasonCode?.[0]?.text ||
										translate('routineCheckup')}
								</span>
							</div>
							<div className='details-modal__info-item'>
								<span className='details-modal__label'>
									{translate('primaryDiagnosis')}:
								</span>
								<span className='details-modal__value'>
									{selected.diagnosis?.[0]?.condition?.display ||
										translate('notSpecified')}
								</span>
							</div>
						</div>
					</section>

					{/* Warning */}
					<section className='details-modal__section details-modal__section_warning'>
						<h4 className='details-modal__section-title details-modal__section-title_warning'>
							<img
								className='details-modal__section-icon'
								src={warningIcon}
								alt='Additional Information icon'
							/>
							{translate('informationAvailabilityTitle')}
						</h4>
						<p className='details-modal__section-text_warning'>
							{translate('informationAvailabilityText')}
						</p>
					</section>
				</div>

				{/* Rodapé */}
				<div className='details-modal__footer'>
					<button
						className='details-modal__btn details-modal__btn_close'
						onClick={handleClose}
					>
						{translate('close')}
					</button>
				</div>
			</div>
		</div>
	);
};

export default DetailsModal;
