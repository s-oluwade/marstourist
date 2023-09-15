import axios from 'axios';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../../components/Providers/AuthContextProvider';
import { User } from '../../models/user';
import FooterSignature from '../../components/FooterSignature';

interface RegisterCredentials {
    fullname: string;
    username: string;
    email: string;
    password: string;
}

const SignUpUserPage = () => {
    const [redirect, setRedirect] = useState(false);
    const [statusCode, setStatusCode] = useState(200);
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
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 409) {
                    setStatusCode(409);
                }
            }
            console.error(error);
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />;
    }

    return (
        <div className='mx-auto flex flex-col'>
            <div className='mt-4 flex grow items-center justify-around'>
                <div className='rounded-2xl bg-base-100 p-8 drop-shadow dark:bg-gray-800'>
                    <h1 className='text-center text-2xl font-medium text-accent'>CREATE ACCOUNT</h1>
                    <form className='mx-auto mt-4 max-w-sm' onSubmit={handleSubmit(onSubmit)}>
                        <input
                            type='text'
                            {...register('fullname', { required: true })}
                            id='fullname'
                            className='input-bordered input-accent input w-full text-base-content'
                            aria-invalid={!!errors.fullname}
                            placeholder='John Doe'
                        />
                        {!!errors.fullname && (
                            <div className='text-xs text-error'>Please provide a name.</div>
                        )}
                        <input
                            type='text'
                            {...register('username', { required: false })}
                            id='username'
                            className='input-bordered input-accent input w-full text-base-content'
                            placeholder='username (optional)'
                        />
                        <input
                            type='email'
                            {...register('email', { required: true })}
                            id='email'
                            className='input-bordered input-accent input w-full text-base-content'
                            aria-invalid={!!errors.email}
                            placeholder='your@email.com'
                        />
                        {!!errors.email && (
                            <div className='text-xs text-error'>Please provide an email.</div>
                        )}
                        <input
                            type='password'
                            {...register('password', { required: true })}
                            id='password'
                            className='input-bordered input-accent input w-full text-base-content'
                            aria-invalid={!!errors.password}
                            placeholder='Password'
                        />
                        {!!errors.password && (
                            <div className='text-xs text-error'>Please provide a password.</div>
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
                        <div
                            className={`mt-2 text-center text-sm text-error ${
                                statusCode === 409 ? 'visible' : 'invisible'
                            }`}
                        >
                            An account already exists with that email/username.
                        </div>
                    </form>
                </div>
            </div>
            <FooterSignature />
        </div>
    );
};

export default SignUpUserPage;
