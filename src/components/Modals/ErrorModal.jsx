import { useTranslations } from '../../hooks/useTranslations';
import useModalClose from '../../hooks/useModalClose';
import './ErrorModal.css';

const ErrorModal = ({ error, onClose, onRetry }) => {
	const { translate } = useTranslations();

	// Hook que lida com o fechamento do modal com clique no dropdown e com a tecla 'Esc'
	const { handleBackdropClick } = useModalClose({ isOpen: error, onClose });

	return (
		<div className='error-modal' onClick={handleBackdropClick}>
			<div
				className='error-modal__content'
				onClick={(e) => e.stopPropagation()}
			>
				<button
					className='error-modal__close-btn'
					onClick={onClose}
					type='button'
					aria-label={translate('close')}
				>
					×
				</button>
				<h2 className='error-modal__title'>{translate('errorTitle')}</h2>
				<p className='error-modal__message'>{translate('errorLoadingData')}</p>
				<div className='error-modal__actions'>
					<button
						className='error-modal__btn error-modal__btn_close'
						onClick={onClose}
						type='button'
					>
						{translate('close')}
					</button>
					<button
						className='error-modal__btn error-modal__btn_retry'
						onClick={onRetry}
						type='button'
					>
						{translate('tryAgain')}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ErrorModal;
