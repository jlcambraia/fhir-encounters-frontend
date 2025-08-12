import { useEffect, useCallback } from 'react';

const useModalClose = ({ isOpen, onClose }) => {
	// Função para fechar com a tecla Escape
	useEffect(() => {
		if (!isOpen) return;

		const handleEsc = (e) => {
			if (e.key === 'Escape') {
				if (document.activeElement) {
					document.activeElement.blur();
				}
				onClose();
			}
		};

		document.addEventListener('keydown', handleEsc);
		return () => document.removeEventListener('keydown', handleEsc);
	}, [isOpen, onClose]);

	// Função para fechar com o clique no backdrop
	const handleBackdropClick = useCallback(
		(e) => {
			if (e.target === e.currentTarget) {
				onClose();
			}
		},
		[onClose]
	);

	return { handleBackdropClick };
};

export default useModalClose;
