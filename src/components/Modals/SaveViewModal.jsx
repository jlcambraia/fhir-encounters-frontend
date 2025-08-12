import { useState, useEffect } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import useModalClose from '../../hooks/useModalClose';
import './SaveViewModal.css';

const SaveViewModal = ({ isOpen, onClose, onSave }) => {
	const { translate } = useTranslations();
	const [viewName, setViewName] = useState('');
	const { handleBackdropClick } = useModalClose({ isOpen, onClose });

	// useEffect que reseta o nome da visualização sempre que o modal é aberto
	useEffect(() => {
		if (isOpen) {
			setViewName('');
		}
	}, [isOpen]);

	// Função para fechar o modal, que também reseta o estado do nome da visualização
	const handleClose = () => {
		setViewName('');
		onClose();
	};

	// Função que lida com o envio do formulário
	const handleSubmit = (e) => {
		e.preventDefault();
		onSave(viewName.trim());
		handleClose();
	};

	// Função que atualiza o estado `viewName` conforme o usuário digita
	const handleInputChange = (e) => {
		setViewName(e.target.value);
	};

	// Se o modal não estiver aberto, não renderiza nada
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
