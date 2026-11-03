import { type ReactTable } from '@tanstack/react-table'
import { ChevronLeft, ChevronRight } from 'lucide-react'


export interface DataTableProps<TTable> {
	table: TTable;
	emptyStateMessage?: string;
	showPagination?: boolean;
}


const DataTable = <TTable,>({
	table,
	emptyStateMessage = 'No records found.',
	showPagination = true
}: DataTableProps<TTable>) => {

	const tableApi = table as ReactTable<any, any>;

	const headerGroups = tableApi.getHeaderGroups();
	const rows = tableApi.getRowModel().rows;
	const columnsCount = tableApi.getVisibleFlatColumns().length;

	return (
		<div className='overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/20 backdrop-blur-sm shadow-sm'>
			{/* Layout Table */}
			<div className='overflow-x-auto'>
				<table className='w-full text-left border-collapse'>
					<thead>
						{headerGroups.map((headerGroup) => (
							<tr
								key={headerGroup.id}
								className='border-b border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/70 dark:bg-zinc-950/40'
							>
								{headerGroup.headers.map((header) => (
									<th
										key={header.id}
										className='px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500'
									>
										{header.isPlaceholder
											? null
											: <tableApi.FlexRender header={header} />
                                        }
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody className='divide-y divide-zinc-100 dark:divide-zinc-800/50'>
						{rows.length > 0 ? (
							rows.map((row) => (
								<tr
									key={row.id}
									className='hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20 transition-colors group'
								>
									{row.getVisibleCells().map((cell) => (
										<td
											key={cell.id}
											className='px-6 py-4 text-sm whitespace-nowrap'
										>
											<tableApi.FlexRender cell={cell} />
										</td>
									))}
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={columnsCount}
									className='px-6 py-12 text-center text-sm text-zinc-400'
								>
									{emptyStateMessage}
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* Grid Pagination Footer Bar */}
			{showPagination && (
				<div className='px-6 py-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between bg-zinc-50/30 dark:bg-zinc-950/10 text-xs text-zinc-500 select-none'>
					<div className='flex items-center gap-1'>
						<span>Page</span>
						<strong className='font-bold text-zinc-700 dark:text-zinc-300'>
							{tableApi.state.pagination.pageIndex + 1} of{' '}
							{tableApi.getPageCount()}
						</strong>
					</div>
					<div className='flex items-center gap-2'>
						<button
							type='button'
							onClick={() => tableApi.previousPage()}
							disabled={!tableApi.getCanPreviousPage()}
							className='p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer'
							title='Previous'
						>
							<ChevronLeft size={14} />
						</button>
						<button
							type='button'
							onClick={() => tableApi.nextPage()}
							disabled={!tableApi.getCanNextPage()}
							className='p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer'
							title='Next'
						>
							<ChevronRight size={14} />
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default DataTable