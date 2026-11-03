import { ShieldCheck, UserCheck } from 'lucide-react'
import AnalyticsChart from '../../components/dashboard/AnalyticsChart.tsx'
import ReferralTable from '../../components/dashboard/ReferralTable.tsx'
import ReferralTree from '../../components/dashboard/ReferralTree.tsx'
import StatCards from '../../components/dashboard/StatCards.tsx'
import { useAuthStore } from '../../store/authStore.ts'


const Home = () => {

	const user = useAuthStore((state) => state.user);

	return (
		<>
			<title>Overview | YieldNexus</title>

			<div className='max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 space-y-2'>
				<h1 className='text-3xl md:text-4xl lg:text-5xl font-normal text-zinc-900 dark:text-zinc-50'>
					Welcome Back,{' '}
					<span
						className='text-blue-600 font-bold'
						title={user?.fullName}
					>
						{user?.fullName}
					</span>
					!
				</h1>

				<div className='flex items-center gap-2 pt-1'>
					{user?.referredBy ? (
						<div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/40 dark:border-zinc-800/80'>
							<UserCheck size={14} className='text-blue-600' />
							<span>
								Referred by:{' '}
								<strong
									className='font-semibold text-zinc-900 dark:text-zinc-200'
									title={user.referredBy.email}
								>
									{user.referredBy.fullName} ({user.referredBy.email})
								</strong>
							</span>
						</div>
					) : (
						<div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs bg-blue-500/10 dark:bg-blue-500/5 text-blue-600 dark:text-blue-400 border border-blue-500/10'>
							<ShieldCheck size={14} />
							<span className='font-medium'>
								{user?.referredBy === null ? 'Root User' : ''}
							</span>
						</div>
					)}
				</div>
			</div>

			<div className='space-y-6 max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8'>
				<div>
					<h1 className='text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight'>
						Account Overview
					</h1>
					<p className='text-xs text-zinc-500 mt-0.5'>
						Real-time network asset parameters, investment
						distribution trackers, and multi-level node layers.
					</p>
				</div>

				<StatCards />

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 items-start'>
					<AnalyticsChart />
					<ReferralTree />
				</div>

				<ReferralTable />
			</div>
		</>
	)
}

export default Home