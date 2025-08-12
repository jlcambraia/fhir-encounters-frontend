import { useContext, useEffect, useCallback } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { EncountersContext } from '../../contexts/EncountersContext';
import { getEncounterDetails } from '../../utils/formatters';
import useModalClose from '../../hooks/useModalClose';
import encounterDetailsIcon from '../../assets/icons/encounter-icon.png';
import encounterInformationIcon from '../../assets/icons/details-icon.png';
import patientIcon from '../../assets/icons/patient-icon.png';
import practitionertIcon from '../../assets/icons/practitioner-icon.png';
import additionalInformationIcon from '../../assets/icons/additional-information-icon.png';
import warningIcon from '../../assets/icons/warning-icon.png';
import './DetailsModal.css';

const DetailsModal = ({ selected, setSelected }) => {
	const { translate, language } = useTranslations();
	const { patients, practitioners } = useContext(EncountersContext);
	const encounterDetails = getEncounterDetails(
		selected,
		patients,
		practitioners,
		translate,
		language
	);

	// Função para fechar o modal, encapsulada com useCallback para otimização
	const handleClose = useCallback(() => {
		setSelected(null);
	}, [setSelected]);

	// Hook que lida com o fechamento do modal com clique no dropdown e com a tecla 'Esc'
	const { handleBackdropClick } = useModalClose({
		isOpen: !!selected, // Passa `!!selected` como `isOpen` para controlar a visibilidade.
		onClose: handleClose,
	});

	// Se o `encounterDetails` for nulo, não renderiza o componente
	if (!encounterDetails) return null;

	return (
		<div
			className='details-modal'
			onClick={handleBackdropClick}
			onKeyDown={(e) => {
				if (e.key === 'Escape') {
					handleClose();
				}
			}}
		>
			<div className='details-modal__content'>
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
								<span className='details-modal__value'>
									{encounterDetails.id}
								</span>
							</div>
							<div className='details-modal__info-item'>
								<span className='details-modal__label'>
									{translate('dateTime')}:
								</span>
								<span className='details-modal__value'>
									{encounterDetails.formattedDateDetails}
								</span>
							</div>
							<div className='details-modal__info-item'>
								<span className='details-modal__label'>
									{translate('status')}:
								</span>
								<span
									className={`details-modal__status ${encounterDetails.statusProps.className}`}
								>
									{encounterDetails.statusProps.text}
								</span>
							</div>
							<div className='details-modal__info-item'>
								<span className='details-modal__label'>
									{translate('encounterType')}:
								</span>
								<span className='details-modal__value'>
									{encounterDetails.encounterType}
								</span>
							</div>
							<div className='details-modal__info-item'>
								<span className='details-modal__label'>
									{translate('location')}:
								</span>
								<span className='details-modal__value'>
									{encounterDetails.location}
								</span>
							</div>
						</div>
					</section>

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
								{encounterDetails.patientData.name.charAt(0).toUpperCase()}
							</div>
							<div className='details-modal__patient-basic'>
								<h4 className='details-modal__patient-name'>
									{encounterDetails.patientData.name}
								</h4>
								<p className='details-modal__patient-id'>
									{translate('patientID')}: {encounterDetails.patientData.id}
								</p>
							</div>
						</div>
						<div className='details-modal__info-grid'>
							<div className='details-modal__info-item'>
								<span className='details-modal__label'>
									{translate('dateOfBirth')}:
								</span>
								<span className='details-modal__value'>
									{encounterDetails.patientData.birthDate}
								</span>
							</div>
							<div className='details-modal__info-item'>
								<span className='details-modal__label'>
									{translate('gender')}:
								</span>
								<span className='details-modal__value'>
									{encounterDetails.patientData.gender}
								</span>
							</div>
							<div className='details-modal__info-item'>
								<span className='details-modal__label'>
									{translate('contact')}:
								</span>
								<span className='details-modal__value'>
									{encounterDetails.patientData.contact}
								</span>
							</div>
							<div className='details-modal__info-item'>
								<span className='details-modal__label'>
									{translate('address')}:
								</span>
								<span className='details-modal__value'>
									{encounterDetails.patientData.address}
								</span>
							</div>
						</div>
					</section>

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
								{encounterDetails.practitionerData.name.charAt(0).toUpperCase()}
							</div>
							<div className='details-modal__practitioner-basic'>
								<h4 className='details-modal__practitioner-name'>
									{encounterDetails.practitionerData.name}
								</h4>
								<p className='details-modal__practitioner-id'>
									{translate('practitionerID')}:{' '}
									{encounterDetails.practitionerData.id}
								</p>
							</div>
						</div>
						<div className='details-modal__info-grid'>
							<div className='details-modal__info-item'>
								<span className='details-modal__label'>
									{translate('specialty')}:
								</span>
								<span className='details-modal__value'>
									{encounterDetails.practitionerData.specialty}
								</span>
							</div>
							<div className='details-modal__info-item'>
								<span className='details-modal__label'>
									{translate('phone')}:
								</span>
								<span className='details-modal__value'>
									{encounterDetails.practitionerData.phone}
								</span>
							</div>
							<div className='details-modal__info-item'>
								<span className='details-modal__label'>
									{translate('email')}:
								</span>
								<span className='details-modal__value'>
									{encounterDetails.practitionerData.email}
								</span>
							</div>
							<div className='details-modal__info-item'>
								<span className='details-modal__label'>
									{translate('department')}:
								</span>
								<span className='details-modal__value'>
									{encounterDetails.practitionerData.department}
								</span>
							</div>
						</div>
					</section>

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
									{encounterDetails.reasonForVisit}
								</span>
							</div>
							<div className='details-modal__info-item'>
								<span className='details-modal__label'>
									{translate('primaryDiagnosis')}:
								</span>
								<span className='details-modal__value'>
									{encounterDetails.primaryDiagnosis}
								</span>
							</div>
						</div>
					</section>

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
