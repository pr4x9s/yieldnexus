import { useState, useMemo, useRef, useEffect } from 'react'
import { columnFilteringFeature, columnVisibilityFeature, createColumnHelper, createFilteredRowModel, createSortedRowModel, filterFn_includesString, globalFilteringFeature, rowPaginationFeature, rowSelectionFeature, rowSortingFeature, tableFeatures, useTable, createPaginatedRowModel, type PaginationState, type SortingState } from '@tanstack/react-table'
import { useDirectReferrals } from '../../hooks/useDashboardData.ts'
import { formatCurrency } from '../../utils/format.ts'
import { format, formatDistanceToNow } from 'date-fns'
import { Search, UserCheck, AlertCircle } from 'lucide-react'
import type { DirectReferralUser } from '../../types/types.ts'
import DataTable from '../common/DataTable.tsx'
import Input from '../common/Input.tsx'



const features = tableFeatures({
    columnFilteringFeature: columnFilteringFeature,
    globalFilteringFeature: globalFilteringFeature,
    rowSortingFeature: rowSortingFeature,
    rowSelectionFeature: rowSelectionFeature,
    rowPaginationFeature: rowPaginationFeature,
    columnVisibilityFeature: columnVisibilityFeature,
    filteredRowModel: createFilteredRowModel(),
    sortedRowModel: createSortedRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
});

const columnHelper = createColumnHelper<typeof features, DirectReferralUser>();

const ReferralTable = () => {
    const { data: apiResponse, isLoading, isError } = useDirectReferrals();
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [debouncedFilter, setDebouncedFilter] = useState<string>('');
    const [sorting, setSorting] = useState<SortingState>([]);
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

    // Safely extract the raw referrals array from our envelope response structure
    const referralsData = useMemo(() => apiResponse?.data || [], [apiResponse]);

    // Define columns
    const columns = columnHelper.columns([
        columnHelper.accessor('fullName', {
            header: 'User',
            cell: (info) => {
                const user = info.row.original;
                return (
                    <div className='flex flex-col'>
                        <span
                            className='font-semibold text-zinc-900 dark:text-zinc-100'
                            title={user.fullName}
                        >
                            {user.fullName}
                        </span>
                    </div>
                );
            },
        }),
        columnHelper.accessor('email', {
            header: 'Email',
            cell: (info) => {
                const user = info.row.original;
                return (
                    <a
                        href={`mailto:${user.email}`}
                        target='_blank'
                        className='font-mono text-blue-500 dark:text-blue-400'
                        title={user.email}
                    >
                        {user.email}
                    </a>
                );
            },
        }),
        columnHelper.accessor('mobileNumber', {
            header: 'Mobile Number',
            cell: (info) => {
                const user = info.row.original;
                return (
                    <a
                        href={`tel:${user.mobileNumber}`}
                        target='_blank'
                        className='font-mono text-blue-500 dark:text-blue-400'
                        title={user.mobileNumber}
                    >
                        {user.mobileNumber}
                    </a>
                );
            },
        }),
        columnHelper.accessor('accountStatus', {
            header: 'Status',
            cell: (info) => {
                const user = info.row.original;
                const isItemActive = user.accountStatus === 'Active';
                return (
                    <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        isItemActive 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-zinc-500/10 border-zinc-500/20 text-zinc-500'
                        }`}
                        title={user.accountStatus}
                    >
                        <span className={`size-1.5 rounded-full ${isItemActive ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
                        {user.accountStatus}
                    </span>
                );
            },
        }),
        columnHelper.accessor('walletBalance', {
            header: 'Wallet Balance',
            cell: (info) => {
                const user = info.row.original;
                return (
                    <span
                        className='font-bold font-mono text-zinc-900 dark:text-zinc-50'
                        title={formatCurrency(user.walletBalance)}
                    >
                        {formatCurrency(user.walletBalance)}
                    </span>
            )
            }
        }),
        columnHelper.accessor('createdAt', {
            header: 'Registration Date',
            cell: (info) => {
                const user = info.row.original;
                return (
                    <span
                        className='text-zinc-400'
                        title={format(user.createdAt, 'PPPPpppp')}
                    >
                        {format(user.createdAt, 'PPp')}{' '}({formatDistanceToNow(new Date(user.createdAt), { addSuffix: true, includeSeconds: true })})
                    </span>
            )
            },
        }),
    ]);

    const table = useTable({
        features,
        data: referralsData ?? [],
        columns,
        state: {
            globalFilter: debouncedFilter,
            sorting,
            pagination,
        },
        globalFilterFn: filterFn_includesString,
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        // getCoreRowModel: getCoreRowModel(),
        // getFilteredRowModel: getFilteredRowModel(),
        // getPaginationRowModel: getPaginationRowModel(),
        // initialState: { pagination: { pageSize: 5 } }
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
                <AlertCircle size={16} /> Direct network data stream loading fault.
            </div>
        );
    }

    return (
        <div className='space-y-4'>
            {/* Filter Toolbelt Interface Section */}
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
                <div className='flex items-center gap-2'>
                    <UserCheck className='h-4 w-4 text-indigo-500' />
                    <h3 className='text-base font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight'>
                        Direct Referral Log{table.getRowModel().rows.length > 1 ? 's' : ''} ({table.getRowModel().rows.length})
                    </h3>
                </div>
                <div className='relative max-w-xs w-full'>
                    <Input 
						type='text'
						value={globalFilter ?? ''}
						onChange={(e) => setGlobalFilter(e.target.value)}
						ref={inputRef}
						placeholder='Search connections...'
						title='Search connections...'
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
                emptyStateMessage='No matching direct referral user logs found.'
                showPagination={true}
            />
        </div>
    )
}

export default ReferralTable