import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLogin } from '../hooks/useLogin.ts'
import { loginUserSchema, type LoginData } from '../validators/auth.validator.ts'
import { Link } from 'react-router'
import { AppWindow, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import Button from '../components/common/Button.tsx'
import Input from '../components/common/Input.tsx'



const Login = () => {
    const { mutate: loginUser, isPending } = useLogin();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const pendingLogoutMessage = sessionStorage.getItem('logout_toast_msg');
        
        if (pendingLogoutMessage) {
            toast.success(pendingLogoutMessage);
            sessionStorage.removeItem('logout_toast_msg');
        }
    }, []);

    const { register, handleSubmit, setFocus, formState: { errors } } = useForm<LoginData>({
        resolver: zodResolver(loginUserSchema),
        mode: 'onTouched'
    });

    const onSubmit = (data: LoginData) => {
        loginUser(data);
    };

    return (
        <>
            <title>Login | YieldNexus</title>

			<section className='relative flex items-center justify-center min-h-screen p-4 bg-zinc-50 dark:bg-zinc-950 overflow-hidden transition-colors duration-300'>

                <div className='w-full max-w-md p-8 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xl transition-all duration-300'>
                    
                    {/* header */}
                    <div className='text-center mb-8'>
                        <Link to='/' className='size-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/20 hover:scale-105 transition-all duration-300'>
                            <AppWindow className='text-white' size={28} />
                        </Link>
                        <h2 className='text-3xl font-extrabold tracking-tight bg-linear-to-r from-zinc-900 via-zinc-800 to-zinc-700 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent'>
                            Sign In
                        </h2>
                        <p className='text-sm text-zinc-500 dark:text-zinc-400 mt-2 font-medium'>
                            Welcome back to Nexachain AI
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                        {/* email */}
                        <Input 
                            label='Email Address'
                            type='email'
                            placeholder='name@company.com'
                            title='Email Address'
                            leftIcon={
                                <Mail 
                                    className='size-4 cursor-pointer'
                                    onClick={() => setFocus('email')}
                                />
                            }
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        {/* password */}
                        <Input 
                            label='Password'
                            type={showPassword ? 'text' : 'password'}
                            placeholder='•••••••'
                            title='Password'
                            leftIcon={
                                <Lock 
                                    className='size-4 cursor-pointer'
                                    onClick={() => setFocus('password')}
                                />
                            }
                            rightElement={
                                <button
                                    type='button'
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer'
                                    title={showPassword ? 'Hide' : 'Show'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            }
                            error={errors.password?.message}
                            {...register('password')}
                        />

                        {/* submission */}
                        <Button
                            type='submit'
                            disabled={isPending}
                            title={isPending ? 'Authenticating...' : 'Sign In'}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className='animate-spin' size={18} />
                                    <span>Authenticating...</span>
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>

                    {/* footer nav links */}
                    <div className='mt-8 pt-5 border-t border-zinc-200 dark:border-zinc-800 text-center space-y-1'>
                        {/* <p className='text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors inline-block borde'>
                            <Link to='/forgot-password'>
                                Forgot Password?
                            </Link>
                        </p> */}
                        <p className='text-sm text-zinc-500 dark:text-zinc-400 font-medium'>
                            Don&apos;t have an account?{' '}
                            <Link to='/register' className='text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-semibold hover:underline transition-colors ml-1' title='Register'>
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Login