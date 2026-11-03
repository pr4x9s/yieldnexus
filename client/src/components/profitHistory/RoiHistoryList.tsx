import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { columnFilteringFeature, columnVisibilityFeature, createColumnHelper, createFilteredRowModel, filterFn_includesString, globalFilteringFeature, rowPaginationFeature, rowSelectionFeature, tableFeatures, useTable, createPaginatedRowModel, type PaginationState, filterFn_equalsString } from '@tanstack/react-table'
import { useGetRoiHistory } from '../../hooks/useInvestments.ts'
import { formatCurrency } from '../../utils/format.ts'
import { format, formatDistanceToNow } from 'date-fns'
import { Search, AlertCircle, Layers, Activity, CheckCircle2, XCircle } from 'lucide-react'
import type { RoiHistoryItem, TabItems } from '../../types/types.ts'
import DataTable from '../common/DataTable.tsx'
import Input from '../common/Input.tsx'


type FilterStatusTabs = RoiHistoryItem['status'] | 'All';

const features = tableFeatures({
    columnFilteringFeature: columnFilteringFeature,
    globalFilteringFeature: globalFilteringFeature,
    rowSelectionFeature: rowSelectionFeature,
    rowPaginationFeature: rowPaginationFeature,
    columnVisibilityFeature: columnVisibilityFeature,
    filteredRowModel: createFilteredRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
});

const columnHelper = createColumnHelper<typeof features, RoiHistoryItem>();


const RoiHistoryList = () => {

	const [globalFilter, setGlobalFilter] = useState('');
	const [debouncedFilter, setDebouncedFilter] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 5
	});

	const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedFilter(globalFilter);
        }, 300);

        return () => clearTimeout(handler);
    }, [globalFilter]);

	const validStatuses: FilterStatusTabs[] = ['All', 'Processed', 'Pending', 'Failed'];
	const statusParam = searchParams.get('status') as FilterStatusTabs;
	const currentStatus = validStatuses.includes(statusParam)? statusParam: 'All';

	const { data: apiResponse, isLoading, isError } = useGetRoiHistory();

	const roiHistoryData = useMemo(() => apiResponse?.data || [], [apiResponse]);

	const handleStatusChange = (statusTabName: FilterStatusTabs) => {
		setSearchParams((prev) => {
			prev.set('status', statusTabName);
			return prev;
		});
	};

	const tabItems: TabItems<FilterStatusTabs> = [
		{
			id: 'All',
			name: 'All Logs',
			icon: Layers,
		},
		{
			id: 'Processed',
			name: 'Processed',
			icon: CheckCircle2,
		},
		{
			id: 'Pending',
			name: 'Pending',
			icon: Activity,
		},
		{
			id: 'Failed',
			name: 'Failed',
			icon: XCircle,
		},
	];

	const getStatusStyle = (status: RoiHistoryItem['status']) => {
		switch (status) {
			case 'Processed':
				return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400';
			case 'Pending':
				return 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400';
			case 'Failed':
				return 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400';
		}
	};

	const columns = columnHelper.columns([
		columnHelper.accessor('investmentReference.planDetails', {
			header: 'Investment Allocation Details',
			cell: (info) => {
				const investmentReference = info.row.original.investmentReference;
				return (
					<div className='flex flex-col max-w-xs sm:max-w-sm md:max-w-md'>
						<span
							className='font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1 group-hover:line-clamp-none transition-all duration-300 wrap-break-word'
							title={investmentReference.planDetails}
						>
							{investmentReference.planDetails || 'N/A'}
						</span>
						<span className='text-[10px] text-zinc-400 mt-1 font-mono'>
							ID:{' '}
							{investmentReference._id || 'N/A'}
						</span>
					</div>
				)
			}
		}),
		columnHelper.accessor('investmentReference.investmentAmount', {
			header: 'Capital Invested',
			cell: (info) => {
				const amount = info.row.original.investmentReference.investmentAmount;
				return (
					<span
						className='font-bold font-mono text-zinc-900 dark:text-zinc-50'
						title={amount ? formatCurrency(amount) : '0'}
					>
						{amount ? formatCurrency(amount) : '—'}
					</span>
				);
			},
		}),
		columnHelper.accessor('roiAmount', {
			header: 'ROI Received',
			cell: (info) => {
				const roiAmount = info.row.original.roiAmount;
				return (
					<span
						className='font-bold font-mono text-emerald-600 dark:text-emerald-400'
						title={formatCurrency(roiAmount)}
					>
						+{formatCurrency(roiAmount)}
					</span>
				)
			}
		}),
		columnHelper.accessor('createdAt', {
			header: 'Date Received',
			cell: (info) => {
				const createdAt = info.row.original.createdAt;
				return (
					<div
						className='flex flex-col text-xs text-zinc-500 dark:text-zinc-400 font-medium'
						title={format(new Date(createdAt), 'PPPPpppp')}
					>
						<span>{format(new Date(createdAt), 'PP')}</span>
						<span className='text-[10px] text-zinc-400 font-normal mt-0.5'>
							(
								{formatDistanceToNow(new Date(createdAt), {
									addSuffix: true,
									includeSeconds: true,
								})}
							)
						</span>
					</div>
				)
			},
		}),
		columnHelper.accessor('status', {
			header: 'Status',
			filterFn: filterFn_equalsString,
			cell: (info) => {
				const status = info.row.original.status;
				return (
					<span
						className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(status)}`}
						title={status}
					>
						<span
							className={`size-1.5 rounded-full ${status === 'Processed' ? 'bg-emerald-500' : status === 'Pending' ? 'bg-blue-500' : 'bg-red-400'}`}
						/>
						{status}
					</span>
				);
			},
		}),
	]);

	// Derived filtering state generated directly from url tracking variables
	const tableFilters = useMemo(() => {
		const filters = [];

		if (currentStatus !== 'All') {
			filters.push({ id: 'status', value: currentStatus });
		}

		return filters;
	}, [currentStatus]);
    
	const table = useTable({
		features,
		data: roiHistoryData,
		columns,
		state: {
            globalFilter: debouncedFilter,
			columnFilters: tableFilters,
			pagination,
		},
        globalFilterFn: filterFn_includesString,
		onGlobalFilterChange: setGlobalFilter,
		onPaginationChange: setPagination,
	});

	if (isLoading) {
		return (
			<div className='w-full space-y-3 animate-pulse'>
				<div className='h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-64' />
				<div className='h-48 bg-zinc-100 dark:bg-zinc-900/40 rounded-2xl border border-zinc-200/40 dark:border-zinc-800/80' />
			</div>
		);
	}

	if (isError) {
		return (
			<div className='p-4 rounded-xl border border-red-200/60 bg-red-50/50 text-red-600 text-sm flex items-center gap-2'>
				<AlertCircle size={16} /> Runtime ROI distributed ledger data stream loading fault.
			</div>
		);
	}

	return (
		<div className='space-y-4'>
			<div className='flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/30 pb-2'>
				<div>
					<h3 className='text-sm font-semibold text-zinc-900 dark:text-zinc-50'>
						Daily Return of Investment Records ({table.getRowModel().rows.length} investment{table.getRowModel().rows.length > 1 ? 's' : ''})
					</h3>
					<p className='text-[11px] text-zinc-400 mt-0.5 mb-4'>
						Track your history of profits and ROI.
					</p>
				
					<div className='flex gap-2 overflow-x-auto scrollbar-none'>
						{tabItems.map((tab) => {
							const isSelected = currentStatus === tab.id;
							return (
								<button
									key={tab.id}
									type='button'
									onClick={() => handleStatusChange(tab.id)}
									className={`py-1.5 px-3 text-xs font-semibold rounded-lg flex items-center gap-1.5 border transition-all cursor-pointer whitespace-nowrap ${
										isSelected
											? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10'
											: 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
									}`}
									title={tab.name}
								>
									<tab.icon size={14} />
									<span>{tab.name}</span>
								</button>
							);
						})}
					</div>
				</div>

				<div className='w-full max-w-xs'>
					<Input 
						type='text'
						value={globalFilter ?? ''}
						onChange={(e) => setGlobalFilter(e.target.value)}
						ref={inputRef}
						placeholder='Search plans...'
						title='Search plans...'
						leftIcon={
							<Search 
								className='size-4 cursor-pointer'
								onClick={() => inputRef.current ? inputRef.current.focus() : null}
							/>
						}
					/>
				</div>
			</div>

			<DataTable 
				table={table}
				emptyStateMessage='No matching logs found for this status.'
				showPagination={true}
			/>
		</div>
	)
}

export default RoiHistoryList