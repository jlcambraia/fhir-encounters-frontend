import { useEffect } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import './ErrorModal.css';

const ErrorModal = ({ error, onClose, onRetry }) => {
	const { translate } = useTranslations();

	useEffect(() => {
		if (!error) return;

		const handleEsc = (e) => {
			if (e.key === 'Escape') onClose();
		};

		document.addEventListener('keydown', handleEsc);
		return () => document.removeEventListener('keydown', handleEsc);
	}, [error, onClose]);

	const handleBackdropClick = (e) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

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
				{/* Título */}
				<h2 className='error-modal__title'>{translate('errorTitle')}</h2>

				{/* Mensagem */}
				<p className='error-modal__message'>{translate('errorLoadingData')}</p>

				{/* Ações */}
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
