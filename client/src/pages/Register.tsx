import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { registerUserSchema, type RegisterData } from '../validators/auth.validator.ts'
import { Link } from 'react-router'
import { AppWindow, Eye, EyeOff, HeartHandshake, Loader2, Lock, Mail, Phone, User } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRegister } from '../hooks/useRegister.ts'
import Button from '../components/common/Button.tsx'
import Input from '../components/common/Input.tsx'



const Register = () => {
    const { mutate: registerUser, isPending } = useRegister();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register, handleSubmit, setFocus, formState: { errors } } = useForm<RegisterData>({
        resolver: zodResolver(registerUserSchema),
        mode: 'onTouched'
    });

    const onSubmit = (data: RegisterData) => {
        registerUser(data);
    };

    return (
        <>
            <title>Register | YieldNexus</title>

            <section className='relative flex items-center justify-center min-h-screen p-4 bg-zinc-50 dark:bg-zinc-950 overflow-hidden transition-colors duration-300'>

                <div className='w-full max-w-4xl p-8 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xl transition-all duration-300'>
                    
                    {/* header */}
                    <div className='text-center mb-8'>
                        <Link to='/' className='size-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/20 hover:scale-105 transition-all duration-300'>
                            <AppWindow className='text-white' size={28} />
                        </Link>
                        <h2 className='text-3xl font-extrabold tracking-tight bg-linear-to-r from-zinc-900 via-zinc-800 to-zinc-700 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent'>
                            Register
                        </h2>
                        <p className='text-sm text-zinc-500 dark:text-zinc-400 mt-2 font-medium'>
                            Join Nexachain AI
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                        {/* fullName */}
                        <Input
                            label='Full Name'
                            type='text'
                            placeholder='Your Name'
                            title='Your Full Name'
                            leftIcon={
                                <User 
                                    className='size-4 cursor-pointer'
                                    onClick={() => setFocus('fullName')}
                                />
                            }
                            error={errors.fullName?.message}
                            {...register('fullName')}
                        />
                        
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

                        {/* mobileNumber */}
                        <Input 
                            label='Mobile Number'
                            type='text'
                            placeholder='+91XXXXXXXXXX'
                            title='Mobile Number'
                            leftIcon={
                                <Phone 
                                    className='size-4 cursor-pointer'
                                    onClick={() => setFocus('mobileNumber')}
                                />
                            }
                            error={errors.mobileNumber?.message}
                            {...register('mobileNumber')}
                        />

                        {/* referralCode */}
                        <Input 
                            label='Referral Code (Optional)'
                            type='text'
                            placeholder='ABC6EXYZ'
                            title='Referral Code'
                            leftIcon={
                                <HeartHandshake 
                                    className='size-4 cursor-pointer'
                                    onClick={() => setFocus('referralCodeUsed')}
                                />
                            }
                            error={errors.referralCodeUsed?.message}
                            {...register('referralCodeUsed')}
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

                        {/* confirmPassword */}
                        <Input 
                            label='Confirm Password'
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder='•••••••'
                            title='Confirm Password'
                            leftIcon={
                                <Lock 
                                    className='size-4 cursor-pointer'
                                    onClick={() => setFocus('confirmPassword')}
                                />
                            }
                            rightElement={
                                <button
                                    type='button'
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className='text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer'
                                    title={showConfirmPassword ? 'Hide' : 'Show'}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            }
                            error={errors.confirmPassword?.message}
                            {...register('confirmPassword')}
                        />

                        {/* submission */}
                        <Button
                            type='submit'
                            disabled={isPending}
                            title={isPending ? 'Registering...' : 'Register'}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className='animate-spin' size={18} />
                                    <span>Registering...</span>
                                </>
                            ) : (
                                'Register'
                            )}
                        </Button>
                    </form>

                    {/* footer nav links */}
                    <div className='mt-8 pt-5 border-t border-zinc-200 dark:border-zinc-800 text-center'>
                        <p className='text-sm text-zinc-500 dark:text-zinc-400 font-medium'>
                            Already have an account?{' '}
                            <Link to='/login' className='text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-semibold hover:underline transition-colors ml-1' title='Sign In'>
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Register