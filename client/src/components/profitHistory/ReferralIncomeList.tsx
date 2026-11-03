import { useEffect, useMemo, useRef, useState } from 'react'
import { columnFilteringFeature, columnVisibilityFeature, createColumnHelper, createFilteredRowModel, filterFn_includesString, globalFilteringFeature, rowPaginationFeature, rowSelectionFeature, tableFeatures, useTable, createPaginatedRowModel, type PaginationState } from '@tanstack/react-table'
import { useGetReferralIncomeHistory } from '../../hooks/useDashboardData.ts'
import { formatCurrency } from '../../utils/format.ts'
import { format, formatDistanceToNow } from 'date-fns'
import { Search, AlertCircle } from 'lucide-react'
import type { ReferralIncomeItem } from '../../types/types.ts'
import DataTable from '../common/DataTable.tsx'
import Input from '../common/Input.tsx'


const features = tableFeatures({
    columnFilteringFeature: columnFilteringFeature,
    globalFilteringFeature: globalFilteringFeature,
    rowSelectionFeature: rowSelectionFeature,
    rowPaginationFeature: rowPaginationFeature,
    columnVisibilityFeature: columnVisibilityFeature,
    filteredRowModel: createFilteredRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
});

const columnHelper = createColumnHelper<typeof features, ReferralIncomeItem>();


const ReferralIncomeList = () => {

	const [globalFilter, setGlobalFilter] = useState('');
	const [debouncedFilter, setDebouncedFilter] = useState('');
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

	const { data: apiResponse, isLoading, isError } = useGetReferralIncomeHistory();

	const levelIncomeData = useMemo(() => apiResponse?.data || [], [apiResponse]);

	const columns = columnHelper.columns([
		columnHelper.accessor('userWhoGenerated.fullName', {
			header: 'Ref. User',
			cell: (info) => {
				const userWhoGenerated = info.row.original.userWhoGenerated;
				return (
					<div className='flex flex-col'>
						<span
							className='font-semibold text-zinc-900 dark:text-zinc-100'
							title={userWhoGenerated.fullName}
						>
							{userWhoGenerated.fullName || 'System Baseline Account'}
						</span>
						<a
							href={`mailto:${userWhoGenerated.email}`}
							target='_blank'
							className='text-[10px] text-blue-500 dark:text-blue-400 font-mono mt-0.5 hover:underline'
						>
							{userWhoGenerated.email}
						</a>
					</div>
				)
			},
		}),
		columnHelper.accessor('referralLevel', {
			header: 'Referral Level',
			cell: (info) => {
				const level = info.row.original.referralLevel;
				return (
					<span
						className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-mono tracking-wide'
						title={`Level ${level}`}
					>
						Lvl {level}
					</span>
				);
			},
		}),
		columnHelper.accessor('incomeAmount', {
			header: 'Income Earned',
			cell: (info) => {
				const incomeAmount = info.row.original.incomeAmount;
				return (
					<span
						className='font-bold font-mono text-emerald-600 dark:text-emerald-400'
						title={formatCurrency(incomeAmount)}
					>
						+{formatCurrency(incomeAmount)}
					</span>
				)
			},
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
	]);

	const table = useTable({
		features,
		data: levelIncomeData,
		columns,
		state: {
			globalFilter: debouncedFilter,
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
				<AlertCircle size={16} /> Multi-level affiliate commission data stream compilation fault.
			</div>
		);
	}

	return (
		<div className='space-y-4'>
			<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1'>
				<div>
					<h3 className='text-sm font-semibold text-zinc-900 dark:text-zinc-50'>
						Referral Income Records ({table.getRowModel().rows.length} user{table.getRowModel().rows.length > 1 ? 's' : ''})
					</h3>
					<p className='text-[11px] text-zinc-400 mt-0.5'>
						Track your history of network commissions earned from downline registrations.
					</p>
				</div>
				<div className='w-full max-w-xs'>
					<Input 
						type='text'
						value={globalFilter ?? ''}
						onChange={(e) => setGlobalFilter(e.target.value)}
						ref={inputRef}
						placeholder='Search users or emails...'
						title='Search users or emails...'
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
				emptyStateMessage='No multi-level structural affiliate profit distributions found.'
				showPagination={true}
			/>
		</div>
	)
}

export default ReferralIncomeList