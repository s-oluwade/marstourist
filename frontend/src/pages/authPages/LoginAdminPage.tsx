import axios from 'axios';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../../components/Providers/AuthContextProvider';
import { Admin } from '../../models/admin';

const adminAccessDenied = import.meta.env.VITE_ADMIN_ACCESS_DENIED;

export interface AdminLoginCredentials {
    name: string;
    password: string;
}

const LoginAdminPage = () => {
    const [redirect, setRedirect] = useState(false);
    const { setAdmin } = useContext(AuthContext);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AdminLoginCredentials>();

    async function onSubmit(credentials: AdminLoginCredentials) {
        try {
            const response = await axios.post<Admin>('/admin/login', credentials, {
                headers: { 'Content-Type': 'application/json' },
            });
            setAdmin(response.data);
            setRedirect(true);
        } catch (error) {
            alert('Login failed');
            console.error(error);
        }
    }

    if (redirect) {
        return <Navigate to={'/dashboard'} />;
    }

    if (adminAccessDenied === 'true') {
        return <div className='my-10 flex grow justify-center text-2xl'>Access Denied</div>;
    }

    return (
        <div className='mx-auto flex flex-col'>
            <div className='mt-4 flex grow items-center justify-around'>
                <div className='mb-24 rounded-2xl border bg-base-100 p-8 shadow-2xl dark:bg-gray-800'>
                    <h1 className='text-center text-2xl font-medium text-neutral dark:text-neutral-content'>
                        ADMIN SIGN IN
                    </h1>
                    <form className='mx-auto mt-4 max-w-sm' onSubmit={handleSubmit(onSubmit)}>
                        <input
                            type='text'
                            className='input-neutral input-bordered input w-full text-base-content'
                            id='admin_name'
                            aria-invalid={errors.name ? 'true' : 'false'}
                            {...register('name', { required: true })}
                            placeholder='johndoe'
                        />
                        {!!errors.name && (
                            <p role='alert' className='text-xs italic text-red-500'>
                                Please fill out this field.
                            </p>
                        )}
                        <input
                            type='password'
                            className='input-neutral input-bordered input w-full text-base-content'
                            id='password'
                            aria-invalid={errors.password ? 'true' : 'false'}
                            {...register('password', { required: true })}
                            placeholder='Password'
                        />
                        {!!errors.password && (
                            <p role='alert' className='text-xs italic text-red-500'>
                                Please choose a password.
                            </p>
                        )}
                        <button className='btn-neutral btn-block btn'>SIGN IN</button>
                        <div className='pt-4 text-center'>
                            <span className='text-sm text-neutral/80 dark:text-neutral-content/80'>
                                Dont have an account?
                            </span>{' '}
                            <Link className='underline' to='/register/admin'>
                                CREATE ACCOUNT
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
                    </ul>
                </div>
            </footer>
        </div>
    );
};

export default LoginAdminPage;
