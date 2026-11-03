import { useSearchParams } from 'react-router'
import { Landmark, History } from 'lucide-react'
import CreateInvestment from '../../components/investments/CreateInvestment.tsx'
import InvestmentList from '../../components/investments/InvestmentList.tsx'
import type { TabItems } from '../../types/types.ts'



type Tabs = 'create' | 'history';


const Investments = () => {

	const [searchParams, setSearchParams] = useSearchParams();

	const validTabs: Tabs[] = ['create', 'history'];

	const tabParam = searchParams.get('tab') as Tabs;

	const activeTab = validTabs.includes(tabParam) ? tabParam : 'create';

	const handleTabChange = (tabName: Tabs) => {
		setSearchParams({ tab: tabName });
	};

	const tabItems: TabItems<Tabs> = [
		{
			id: 'create',
			name: 'Invest Capital',
			icon: Landmark,
		},
		{
			id: 'history',
			name: 'View Investments',
			icon: History,
		},
	];

	return (
		<>
			<title>Investments | YieldNexus</title>

			<div className='max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 space-y-6'>

				<div>
					<h1 className='text-3xl md:text-4xl lg:text-5xl font-normal text-zinc-900 dark:text-zinc-50'>
						Investment Engine
					</h1>
					<p className='text-xs text-zinc-500 mt-1'>
						Deploy capital into automated AI-driven mining contracts and monitor operational yields.
					</p>
				</div>

				<div className='border-b border-zinc-200 dark:border-zinc-800/30 sticky -top-6 bg-zinc-50/50 dark:bg-zinc-950/20 backdrop-blur-sm z-20 select-none -mx-4 px-4 md:-mx-8 md:px-8'>
					<div className='flex gap-4 md:gap-6 overflow-x-auto scrollbar-none'>
						{tabItems.map((tab) => {
							const isSelected = activeTab === tab.id;

							return (
								<button
									key={tab.id}
									type='button'
									onClick={() => handleTabChange(tab.id)}
									className={`py-3.5 px-1 text-xs md:text-sm font-semibold tracking-wide flex items-center gap-2 relative transition-colors duration-200 cursor-pointer whitespace-nowrap ${
										isSelected
											? 'text-blue-600 dark:text-blue-500'
											: 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
									}`}
									title={tab.name}
									role='radio'
									aria-checked={isSelected}
								>
									<tab.icon size={16} />
									<span>{tab.name}</span>

									{isSelected && (
										<div className='absolute bottom-0 left-0 w-full h-0.75 bg-blue-600 dark:bg-blue-500 rounded-t-full transition-all duration-300' />
									)}
								</button>
							);
						})}
					</div>
				</div>

				<div className='mt-6 bg-white dark:bg-zinc-950/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 p-4 md:p-6 shadow-sm shadow-zinc-100/10 dark:shadow-none'>
					{activeTab === 'create' && <CreateInvestment />}
					{activeTab === 'history' && <InvestmentList />}
				</div>
			</div>
		</>
	)
}

export default Investments