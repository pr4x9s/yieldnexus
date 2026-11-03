import { Menu, Sun, Moon, LogOut, Check, Copy } from 'lucide-react'
import { useAuthStore } from '../../store/authStore.ts'
import { useThemeStore } from '../../store/themeStore.ts'
import { Link } from 'react-router'
import React, { useState, useRef, useEffect } from 'react'
import { cn } from '../../utils/cn.ts'
import ConfirmationModal from '../common/ConfirmationModal.tsx'
import { useLogout } from '../../hooks/useLogout.ts'
import { toast } from 'sonner'


interface NavbarProps {
	onMenuClick: () => void;
}


const Navbar = ({ onMenuClick }: NavbarProps) => {

	const user = useAuthStore(state => state.user);
	const { isDarkMode, toggleTheme } = useThemeStore();

	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
	const [copied, setCopied] = useState(false);
	const [copyError, setCopyError] = useState('');

	const { mutate: performLogout, isPending: isLoggingOut } = useLogout();

	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setIsDropdownOpen(false);
			}
		};

		if (isDropdownOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, [isDropdownOpen]);

	const handleLogoutConfirm = () => {
		performLogout();
	};

	const handleCopyReferralCode = async (e: React.MouseEvent) => {
		e.stopPropagation();

		if (!user?.referralCode) return;

		try {
			if (navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(user.referralCode);
				setCopied(true);
				toast.success('Referral Code Copied to Clipboard!');
				setTimeout(() => setCopied(false), 3000);
			}
			else {
				throw new Error('Clipboard API blocked due to insecure context environment');
			}
		}
		catch (error) {
			console.warn('Copy action failed:', error);
			toast.error('Copy failed');
			setCopyError('Copy failed');
			setTimeout(() => setCopyError(''), 3000);
		}
	};

	return (
		<>
			<nav className='h-16 bg-white dark:bg-zinc-950 flex items-center justify-between px-6 sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-900'>
				{/* Left Section: Brand Logo */}
				<div className='flex items-center gap-4'>
					<button
						onClick={onMenuClick}
						className='p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors cursor-pointer text-zinc-800 dark:text-zinc-200'
					>
						<Menu size={22} />
					</button>
					<Link to='/dashboard' className='group'>
						<div className='flex items-center gap-2 font-bold text-xl tracking-tight'>
							{/* <div className='bg-blue-600 p-1.5 rounded-lg group-hover:-rotate-6 transition-all ease-in-out'>
								<AppWindow
									size={18}
									className='text-white'
								/>
							</div> */}
							<span className='text-zinc-900 dark:text-zinc-100'>
								Nexachain AI
							</span>
						</div>
					</Link>
				</div>

				{/* Right Section: Configuration Panels */}
				<div
					className='flex items-center gap-4 relative'
					ref={dropdownRef}
				>
					<button
						onClick={toggleTheme}
						className='flex items-center text-blue-700 dark:text-zinc-200 border border-blue-600/10 hover:bg-blue-600/10 dark:border-zinc-800 p-2 rounded-full font-semibold transition-all active:scale-95 cursor-pointer'
						title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
					>
						{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
					</button>

					<div className='relative'>
						<button
							onClick={() => setIsDropdownOpen(!isDropdownOpen)}
							className='block focus:outline-none relative rounded-full border-2 border-blue-500 shadow-sm active:scale-95 transition-transform'
							title={user?.fullName || 'User Profile'}
						>
							<img
								src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=1C90ED&color=fff`}
								className='size-9 rounded-full object-cover cursor-pointer'
								alt='User Avatar'
							/>
						</button>

						{/* Dropdown Card Grid */}
						<div
							className={cn(
								'absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl transition-all duration-200 transform origin-top-right z-50 overflow-hidden',
								isDropdownOpen
									? 'opacity-100 scale-100 pointer-events-auto'
									: 'opacity-0 scale-95 pointer-events-none',
							)}
						>
							<div className='p-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col bg-zinc-50/50 dark:bg-zinc-950/20'>
								<p className='text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate' title={user?.fullName}>
									{user?.fullName}
								</p>
								<p className='text-xs text-zinc-500 dark:text-zinc-400 truncate' title={user?.email}>
									{user?.email}
								</p>

								{user?.referralCode && (
									<div className='flex items-center justify-between p-2 rounded-xl bg-zinc-100/80 dark:bg-zinc-800/60 border-dashed border-zinc-200/40 dark:border-zinc-700/30 transition-colors mt-5'>
										<div className='flex flex-col text-left'>
											<span className='text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1'>
												My Referral Code
											</span>
											<span className={`text-center px-3 py-1.5 rounded-xl text-xs bg-blue-500/10 dark:bg-blue-500/5 text-blue-600 dark:text-blue-400 border border-dashed border-blue-500/50 font-bold font-mono tracking-wider ${copied ? 'bg-blue-500/30 dark:bg-blue-500/30' : ''}`}>
												{user.referralCode}
											</span>
										</div>
										<button
											onClick={handleCopyReferralCode}
											disabled={!!copyError}
											className={cn(
												'p-1.5 rounded-lg border text-zinc-500 dark:text-zinc-400 transition-all active:scale-90 cursor-pointer',
												copied
													? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-400'
													: 'bg-white border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-700 dark:hover:bg-zinc-800'
											)}
											title={copyError ? 'Copy Blocked': 'Copy Code'}
										>
											{copied ? <Check size={13} className='stroke-[2.5]' /> : <Copy size={13} />}
										</button>
									</div>
								)}
							</div>

							{/* <div className='p-1.5 space-y-0.5'>
								<Link
									to='/dashboard/home'
									onClick={() => setIsDropdownOpen(false)}
									className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors'
									title='System Settings'
								>
									<Settings
										size={18}
										className='text-zinc-400'
									/>
									<span>System Settings</span>
								</Link>
							</div> */}

							{/* <div className='p-1.5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-950/10'> */}
							<div className='p-1.5 bg-zinc-50/30 dark:bg-zinc-950/10'>
								<button
									onClick={() => {
										setIsDropdownOpen(false);
										setIsLogoutModalOpen(true);
									}}
									className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer group'
									title='Sign Out'
								>
									<LogOut
										size={18}
										className='text-red-500 group-hover:translate-x-0.5 transition-transform'
									/>
									<span>Sign Out</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</nav>

			<ConfirmationModal
				isOpen={isLogoutModalOpen}
				onClose={() => setIsLogoutModalOpen(false)}
				onConfirm={handleLogoutConfirm}
				isPending={isLoggingOut}
				title='Sign Out'
				description='Are you sure you want to log out of your session context?'
				confirmText='Sign Out'
			/>
		</>
	)
}

export default Navbar