import { useContext } from 'react';
import { useTranslations } from '../../../../hooks/useTranslations';
import { FiltersContext } from '../../../../contexts/FiltersContext';
import './Pagination.css';

const Pagination = ({ totalPages }) => {
	// ============================================
	// HOOKS E CONTEXTOS
	// ============================================
	const { translate } = useTranslations();
	const { rowsPerPage, setRowsPerPage, page, setPage } =
		useContext(FiltersContext);

	// ============================================
	// FUNÇÃO PARA CALCULAR PÁGINAS VISÍVEIS
	// ============================================
	const getVisiblePages = (currentPage, totalPages) => {
		const maxButtons = 5;
		let start = Math.max(currentPage - 2, 1);
		let end = start + maxButtons - 1;

		if (end > totalPages) {
			end = totalPages;
			start = Math.max(end - maxButtons + 1, 1);
		}

		const pages = [];
		for (let i = start; i <= end; i++) {
			pages.push(i);
		}
		return pages;
	};

	// ============================================
	// FUNÇÕES DE MANIPULAÇÃO DA PAGINAÇÃO
	// ============================================
	const handleRowsPerPageChange = (e) => {
		setRowsPerPage(Number(e.target.value));
		setPage(1);
	};

	const handlePreviousPage = () => {
		setPage((previousPage) => Math.max(previousPage - 1, 1));
	};

	const handleNextPage = () => {
		setPage((previousPage) => Math.min(previousPage + 1, totalPages));
	};

	const handlePageClick = (pageNumber) => {
		setPage(pageNumber);
	};

	// ============================================
	// FUNÇÃO PARA RENDERIZAR BOTÕES DE PÁGINAS
	// ============================================
	const renderPageButtons = () => {
		return getVisiblePages(page, totalPages).map((pageNumber) => (
			<button
				key={pageNumber}
				className={`pagination__btn ${
					page === pageNumber ? 'pagination__btn_active' : ''
				}`}
				aria-current={page === pageNumber ? 'page' : undefined}
				onClick={() => handlePageClick(pageNumber)}
			>
				{pageNumber}
			</button>
		));
	};

	// ============================================
	// RENDERIZAÇÃO PRINCIPAL
	// ============================================
	return (
		<div className='pagination'>
			{/* Seletor de Linhas por Página */}
			<label>
				{translate('rowsPerPage')}:
				<select
					className='pagination__select'
					value={rowsPerPage}
					onChange={handleRowsPerPageChange}
				>
					<option value='10'>10</option>
					<option value='25'>25</option>
					<option value='50'>50</option>
				</select>
			</label>

			{/* Controles de Paginação */}
			<div className='pagination__controls'>
				{/* Botão Página Anterior */}
				<button
					className='pagination__btn'
					aria-label={translate('previousPage')}
					disabled={page <= 1}
					onClick={handlePreviousPage}
				>
					‹
				</button>

				{/* Botões das Páginas */}
				{renderPageButtons()}

				{/* Botão Próxima Página */}
				<button
					className='pagination__btn'
					aria-label={translate('nextPage')}
					disabled={page >= totalPages}
					onClick={handleNextPage}
				>
					›
				</button>
			</div>
		</div>
	);
};

export default Pagination;
