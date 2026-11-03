import { Outlet } from "react-router";
import { Toaster } from "sonner";
import { useThemeStore } from "./store/themeStore";
import { useEffect } from "react";

const App = () => {
	const { isDarkMode } = useThemeStore();

	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [isDarkMode]);

	return (
		<div className="min-h-screen transition-colors duration-300 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">
			<Toaster richColors expand={false} duration={3000} theme={isDarkMode ? 'dark' : 'light'} />
			<Outlet />
		</div>
	)
}

export default App