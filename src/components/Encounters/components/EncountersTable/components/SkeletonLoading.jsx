import './SkeletonLoading.css';

const SkeletonLoading = () => {
	// ============================================
	// DADOS DAS COLUNAS DA TABELA
	// ============================================
	const skeletonColumns = [
		{ className: 'table__cell_id', key: 'id' },
		{ className: 'table__cell_patient', key: 'patient' },
		{ className: 'table__cell_practitioner', key: 'practitioner' },
		{ className: '', key: 'date' }, // coluna de data
		{ className: '', key: 'status' }, // coluna de status
	];

	// ============================================
	// RENDERIZAÇÃO
	// ============================================
	return (
		<tr className='table__row table__row_skeleton'>
			{skeletonColumns.map((column) => (
				<td key={column.key} className={`table__cell ${column.className}`}>
					<div className='skeleton skeleton__text'></div>
				</td>
			))}
		</tr>
	);
};

export default SkeletonLoading;
