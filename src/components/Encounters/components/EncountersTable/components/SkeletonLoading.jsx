import './SkeletonLoading.css';

const SkeletonLoading = () => {
	// Define a estrutura das colunas para o esqueleto, com classes CSS e chaves
	const skeletonColumns = [
		{ className: 'table__cell_id', key: 'id' },
		{ className: 'table__cell_patient', key: 'patient' },
		{ className: 'table__cell_practitioner', key: 'practitioner' },
		{ className: '', key: 'date' },
		{ className: '', key: 'status' },
	];

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
