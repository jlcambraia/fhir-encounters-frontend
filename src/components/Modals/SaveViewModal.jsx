import { useState, useEffect } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import './SaveViewModal.css';

const SaveViewModal = ({ isOpen, onClose, onSave }) => {
	const { translate } = useTranslations();
	const [viewName, setViewName] = useState('');

	useEffect(() => {
		if (isOpen) {
			setViewName('');
		}
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;

		const handleEsc = (e) => {
			if (e.key === 'Escape') onClose();
		};

		document.addEventListener('keydown', handleEsc);
		return () => document.removeEventListener('keydown', handleEsc);
	}, [isOpen, onClose]);

	const handleClose = () => {
		setViewName('');
		onClose();
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		onSave(viewName.trim());
		handleClose();
	};

	const handleBackdropClick = (e) => {
		if (e.target === e.currentTarget) {
			handleClose();
		}
	};

	const handleInputChange = (e) => {
		setViewName(e.target.value);
	};

	if (!isOpen) return null;

	return (
		<div className='save-view-modal' onClick={handleBackdropClick}>
			<div
				className='save-view-modal__content'
				onClick={(e) => e.stopPropagation()}
			>
				<button
					className='save-view-modal__close-btn'
					onClick={handleClose}
					type='button'
					aria-label={translate('close')}
				>
					×
				</button>

				<h2 className='save-view-modal__title'>{translate('saveView')}</h2>
				<p className='save-view-modal__subtitle'>
					{translate('saveViewSubtitle')}
				</p>

				<form onSubmit={handleSubmit} className='save-view-modal__form'>
					<input
						type='text'
						className='save-view-modal__input'
						value={viewName}
						onChange={handleInputChange}
						placeholder={translate('enterViewName')}
						autoFocus
						maxLength={30}
					/>

					<div className='save-view-modal__actions'>
						<button
							type='button'
							className='save-view-modal__btn save-view-modal__btn_cancel'
							onClick={handleClose}
						>
							{translate('cancel')}
						</button>
						<button
							type='submit'
							className='save-view-modal__btn save-view-modal__btn_save'
							disabled={!viewName.trim()}
						>
							{translate('save')}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SaveViewModal;
