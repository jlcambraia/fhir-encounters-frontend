import { useTranslations } from '../../hooks/useTranslations';
import { useFilters } from '../../hooks/useFilters';
import filterIcon from '../../assets/icons/filter-icon.png';
import SaveViewModal from '../Modals/SaveViewModal';
import './Filters.css';

const Filters = () => {
	const { translate } = useTranslations();
	const {
		isSaveViewModalOpen,
		filters,
		saveViews,
		selectedSaveView,
		handleFilterChange,
		handleFormSubmit,
		handleFormReset,
		handleSelectSaveView,
		handleSaveView,
		handleSaveViewConfirm,
		handleCloseSaveViewModal,
	} = useFilters();

	return (
		<section className='filters'>
			<div className='filters__title-container'>
				<img
					className='filters__icon'
					src={filterIcon}
					alt='Icon of a filter'
				/>
				<h2 className='filters__title'>{translate('filtersAndSearch')}</h2>
			</div>

			<form
				className='filters__form'
				onSubmit={handleFormSubmit}
				onReset={handleFormReset}
			>
				<div className='filters__field'>
					<label className='filters__label' htmlFor='patientName'>
						{translate('filterPatient')}
					</label>
					<input
						id='patientName'
						className='filters__input'
						type='text'
						placeholder={translate('searchPlaceholder')}
						name='patientName'
						value={filters.patientName}
						onChange={handleFilterChange}
					/>
				</div>

				<div className='filters__field'>
					<label className='filters__label' htmlFor='startDate'>
						{translate('filterStartDate')}
					</label>
					<input
						id='startDate'
						className='filters__input filters__input_date'
						type='date'
						name='startDate'
						value={filters.startDate}
						onChange={handleFilterChange}
					/>
				</div>

				<div className='filters__field'>
					<label className='filters__label' htmlFor='endDate'>
						{translate('filterEndDate')}
					</label>
					<input
						id='endDate'
						className='filters__input filters__input_date'
						type='date'
						name='endDate'
						value={filters.endDate}
						onChange={handleFilterChange}
					/>
				</div>

				<div className='filters__field'>
					<label className='filters__label' htmlFor='savedViews'>
						{translate('filterSavedViews')}
					</label>
					<select
						id='savedViews'
						className='filters__select'
						name='savedViews'
						value={selectedSaveView}
						onChange={handleSelectSaveView}
					>
						<option value='' disabled>
							{translate('savedViewsPlaceholder')}
						</option>
						{Object.entries(saveViews).map(([key]) => (
							<option key={key} value={key}>
								{key}
							</option>
						))}
					</select>
				</div>

				<div className='filters__btns'>
					<button type='reset' className='filters__btn filters__btn_clear'>
						{translate('clear')}
					</button>

					<button
						type='button'
						className='filters__btn filters__btn_save'
						onClick={handleSaveView}
					>
						{translate('saveView')}
					</button>
				</div>
			</form>

			<SaveViewModal
				isOpen={isSaveViewModalOpen}
				onClose={handleCloseSaveViewModal}
				onSave={handleSaveViewConfirm}
			/>
		</section>
	);
};

export default Filters;
