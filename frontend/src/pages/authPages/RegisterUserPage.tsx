import axios from 'axios';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../../components/Providers/AuthContext';
import { User } from '../../models/user';

interface RegisterCredentials {
    fullname: string;
    username: string;
    email: string;
    password: string;
}

const SignUpUserPage = () => {
    const [redirect, setRedirect] = useState(false);
    const { setUser } = useContext(AuthContext);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterCredentials>();

    async function onSubmit(credentials: RegisterCredentials) {
        try {
            const response = await axios.post<User>('/user/register', credentials, {
                headers: { 'Content-Type': 'application/json' },
            });
            setUser(response.data);
            setRedirect(true);
        } catch (error) {
            alert('Registration failed');
            console.error(error);
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />;
    }

    return (
        <div className='mx-auto flex flex-col'>
            <div className='mt-4 flex grow items-center justify-around'>
                <div className='mb-24 rounded-2xl border bg-base-100 p-8 shadow-2xl dark:bg-gray-800'>
                    <h1 className='text-center text-2xl font-medium text-accent'>CREATE ACCOUNT</h1>
                    <form className='mx-auto mt-4 max-w-sm' onSubmit={handleSubmit(onSubmit)}>
                        <input
                            type='text'
                            {...register('fullname', { required: true })}
                            id='fullname'
                            className='input-bordered input-accent input w-full'
                            aria-invalid={!!errors.fullname}
                            placeholder='John Doe'
                        />
                        {!!errors.fullname && (
                            <p role='alert' className='alert text-xs italic text-red-500'>
                                Please fill out this field.
                            </p>
                        )}
                        <input
                            type='text'
                            {...register('username', { required: false })}
                            id='username'
                            className='input-bordered input-accent input w-full'
                            placeholder='username (optional)'
                        />
                        <input
                            type='email'
                            {...register('email', { required: true })}
                            id='email'
                            className='input-bordered input-accent input w-full'
                            aria-invalid={!!errors.email}
                            placeholder='your@email.com'
                        />
                        {!!errors.email && (
                            <p role='alert' className='alert text-xs italic text-red-500'>
                                Please fill out this field.
                            </p>
                        )}
                        <input
                            type='password'
                            {...register('password', { required: true })}
                            id='password'
                            className='input-bordered input-accent input w-full'
                            aria-invalid={!!errors.password}
                            placeholder='Password'
                        />
                        {!!errors.password && (
                            <p role='alert' className='alert text-xs italic text-red-500'>
                                Please choose a password.
                            </p>
                        )}
                        <button className='btn-accent btn-block btn'>CREATE ACCOUNT</button>
                        <div className='pt-4 text-center'>
                            <span className='text-sm text-neutral/80 dark:text-neutral-content/80'>
                                Already a member?
                            </span>{' '}
                            <Link className='underline' to='/login/user'>
                                Sign In
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
            <footer className='my-4 w-full bg-transparent'>
                <div className='mx-auto w-full p-4 md:flex md:items-center md:justify-end md:gap-6'>
                    <span className='text-xs text-neutral/90 sm:text-center'>
                        © 2023 Samuel Oluwade
                    </span>
                    <ul className='mt-3 flex flex-wrap items-center text-xs font-medium text-neutral/50 sm:mt-0'>
                        <li>
                            <a
                                target='_blank'
                                href='https://github.com/s-oluwade'
                                className='mr-4 flex items-center hover:underline md:mr-6'
                            >
                                Github
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth={1.5}
                                    stroke='currentColor'
                                    className='h-4 w-4'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        d='M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25'
                                    />
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a
                                target='_blank'
                                href='https://www.cookiepolicygenerator.com/live.php?token=13A7pWhd9KInJXDPINssDYTkGQ2Q5ghI'
                                className='mr-4 flex items-center hover:underline md:mr-6'
                            >
                                Cookie Policy
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth={1.5}
                                    stroke='currentColor'
                                    className='h-4 w-4'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        d='M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25'
                                    />
                                </svg>
                            </a>
                        </li>
                    </ul>
                </div>
            </footer>
        </div>
    );
};

export default SignUpUserPage;
