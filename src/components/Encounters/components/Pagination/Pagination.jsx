import { useContext } from 'react';
import { useTranslations } from '../../../../hooks/useTranslations';
import { FiltersContext } from '../../../../contexts/FiltersContext';
import './Pagination.css';

const Pagination = ({ totalPages }) => {
	const { translate } = useTranslations();
	const { rowsPerPage, setRowsPerPage, page, setPage } =
		useContext(FiltersContext);

	// Função para calcular quais botões de página devem ser visíveis
	const getVisiblePages = (currentPage, totalPages) => {
		// Define o número máximo de botões de página a serem mostrados
		const maxButtons = 5;
		// Determina o botão inicial da sequência, garantindo que não seja menor que 1
		let start = Math.max(currentPage - 2, 1);
		// Determina o botão final da sequência.
		let end = start + maxButtons - 1;

		// Ajusta a sequência se o final ultrapassar o número total de páginas
		if (end > totalPages) {
			end = totalPages;
			start = Math.max(end - maxButtons + 1, 1);
		}

		// Cria um array com os números das páginas visíveis
		const pages = [];
		for (let i = start; i <= end; i++) {
			pages.push(i);
		}
		return pages;
	};

	// Função que lida com a alteração do número de linhas por página
	const handleRowsPerPageChange = (e) => {
		// Atualiza o estado de linhas por página
		setRowsPerPage(Number(e.target.value));
		// Volta para a primeira página após a alteração
		setPage(1);
	};

	// Função que lida com o clique no botão "Página Anterior"
	const handlePreviousPage = () => {
		// Atualiza o estado da página, garantindo que não seja menor que 1
		setPage((previousPage) => Math.max(previousPage - 1, 1));
	};

	// Função que lida com o clique no botão "Próxima Página"
	const handleNextPage = () => {
		// Atualiza o estado da página, garantindo que não ultrapasse o número total de páginas
		setPage((previousPage) => Math.min(previousPage + 1, totalPages));
	};

	// Função que lida com o clique em um botão de página específico
	const handlePageClick = (pageNumber) => {
		// Define a página atual para o número clicado
		setPage(pageNumber);
	};

	// Função para renderizar os botões de página dinamicamente
	const renderPageButtons = () => {
		// Obtém o array de páginas visíveis e mapeia cada uma para um botão
		return getVisiblePages(page, totalPages).map((pageNumber) => (
			<button
				key={pageNumber}
				// Aplica a classe `active` se for a página atual
				className={`pagination__btn ${
					page === pageNumber ? 'pagination__btn_active' : ''
				}`}
				// Atributo ARIA para acessibilidade, indicando a página atual
				aria-current={page === pageNumber ? 'page' : undefined}
				onClick={() => handlePageClick(pageNumber)}
			>
				{pageNumber}
			</button>
		));
	};

	return (
		<div className='pagination'>
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

			<div className='pagination__controls'>
				<button
					className='pagination__btn'
					aria-label={translate('previousPage')}
					disabled={page <= 1}
					onClick={handlePreviousPage}
				>
					‹
				</button>

				{renderPageButtons()}

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
