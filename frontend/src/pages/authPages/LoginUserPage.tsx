import axios from 'axios';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../../components/Providers/AuthContextProvider';
import { User } from '../../models/user';

interface LoginCredentials {
    email: string;
    password: string;
    userType: 'user' | 'admin';
}

const LoginUserPage = () => {
    const [redirect, setRedirect] = useState(false);
    const { setUser } = useContext(AuthContext);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginCredentials>();

    async function onSubmit(credentials: LoginCredentials) {
        try {
            const response = await axios.post<User>('/user/login', credentials, {
                headers: { 'Content-Type': 'application/json' },
            });
            setUser(response.data);
            setRedirect(true);
        } catch (error) {
            alert('Login failed');
            console.error(error);
        }
    }

    if (redirect) return <Navigate to={'/'} />;

    return (
        <div className='mx-auto flex flex-col'>
            <div className='mt-4 flex grow items-center justify-around'>
                <div className='rounded-2xl bg-base-100 p-8 drop-shadow dark:bg-gray-800'>
                    <h1 className='text-center text-2xl font-medium text-accent'>SIGN IN</h1>
                    <form className='mx-auto mt-4 max-w-sm' onSubmit={handleSubmit(onSubmit)}>
                        <input
                            type='email'
                            {...register('email', { required: true })}
                            className='input-bordered input-accent input w-full text-base-content'
                            id='email'
                            aria-invalid={!!errors.email}
                            placeholder='your@email.com'
                        />
                        {!!errors.email && (
                            <div className='text-xs text-error'>Please provide an email.</div>
                        )}
                        <input
                            type='password'
                            {...register('password', { required: true })}
                            className='input-bordered input-accent input w-full text-base-content'
                            id='password'
                            aria-invalid={!!errors.password}
                            placeholder='Password'
                        />
                        {!!errors.password && (
                            <div className='text-xs text-error'>Please provide a password.</div>
                        )}
                        <input
                            type='hidden'
                            {...register('userType', { required: true })}
                            id='userType'
                            value='user'
                        />
                        <button className='btn-accent btn-block btn'>Sign In</button>
                        <div className='pt-4 text-center'>
                            <span className='text-sm text-neutral/80 dark:text-neutral-content/80'>
                                Dont have an account?
                            </span>{' '}
                            <Link className='underline' to='/register/user'>
                                Create Account
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginUserPage;
