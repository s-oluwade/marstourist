import axios from 'axios';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../../components/Providers/AuthContextProvider';
import { Admin } from '../../models/admin';
import FooterSignature from '../../components/FooterSignature';

export interface AdminRegisterCredentials {
    name: string;
    password: string;
    email: string;
}

const RegisterAdminPage = () => {
    const [redirect, setRedirect] = useState(false);
    const { setAdmin } = useContext(AuthContext);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AdminRegisterCredentials>();

    async function onSubmit(credentials: AdminRegisterCredentials) {
        try {
            const response = await axios.post<Admin>('/admin/register', credentials, {
                headers: { 'Content-Type': 'application/json' },
            });
            setAdmin(response.data);

            setRedirect(true);
        } catch (error) {
            alert('Registration failed');
            console.error(error);
        }
    }

    if (redirect) {
        return <Navigate to={'/dashboard'} />;
    }

    return (
        <div className='mx-auto flex flex-col'>
            <div className='mt-4 flex grow items-center justify-around'>
                <div className='rounded-2xl bg-base-100 p-8 drop-shadow dark:bg-gray-800'>
                    <h1 className='text-center text-2xl font-medium text-neutral dark:text-neutral-content'>
                        ADMIN CREATE ACCOUNT
                    </h1>
                    <form className='mx-auto mt-4 max-w-sm' onSubmit={handleSubmit(onSubmit)}>
                        <input
                            type='text'
                            id='admin-name'
                            className='input-neutral input-bordered input w-full text-base-content'
                            {...register('name', { required: false })}
                            placeholder='johndoe'
                        />
                        <input
                            type='email'
                            id='email'
                            className='input-neutral input-bordered input w-full text-base-content'
                            aria-invalid={errors.email ? 'true' : 'false'}
                            {...register('email', { required: true })}
                            placeholder='your@email.com'
                        />
                        {!!errors.email && (
                            <p role='alert' className='alert text-xs italic text-red-900'>
                                Please fill out this field.
                            </p>
                        )}
                        <input
                            type='password'
                            id='password'
                            className='input-neutral input-bordered input w-full text-base-content'
                            aria-invalid={errors.password ? 'true' : 'false'}
                            {...register('password', { required: true })}
                            placeholder='Password'
                        />
                        {!!errors.password && (
                            <p role='alert' className='text-red alert text-xs italic'>
                                Please choose a password.
                            </p>
                        )}
                        <button className='btn-neutral btn-block btn'>CREATE ACCOUNT</button>
                        <div className='pt-4 text-center'>
                            <span className='text-sm text-neutral/80 dark:text-neutral-content/80'>
                                Already a member?
                            </span>{' '}
                            <Link className='underline' to='/login/admin'>
                                SIGN IN
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
            <FooterSignature/>
        </div>
    );
};

export default RegisterAdminPage;
