import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../../components/Providers/AuthContext";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Admin } from "../../models/admin";

const adminAccessDenied = import.meta.env.VITE_ADMIN_ACCESS_DENIED

export interface AdminLoginCredentials {
    name: string,
    password: string,
}

const LoginAdminPage = () => {
    const [redirect, setRedirect] = useState(false);
    const { setAdmin } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm<AdminLoginCredentials>();

    async function onSubmit(credentials: AdminLoginCredentials) {
        try {
            const response = await axios.post<Admin>("/admin/login", credentials, { headers: { "Content-Type": "application/json" } });
            setAdmin(response.data);
            setRedirect(true);
        } catch (error) {
            alert("Login failed");
            console.error(error);
        }
    }

    if (redirect) {
        return <Navigate to={'/dashboard'} />
    }

    if (adminAccessDenied === "true") {
        return <div className="flex justify-center grow my-10 text-2xl">Access Denied</div>
    }

    return (
        <div className="flex flex-col mx-auto">
            <div className="mt-4 grow flex items-center justify-around">
                <div className="mb-24 p-8 border rounded-2xl shadow-2xl bg-base-100">
                    <h1 className="text-2xl font-medium text-center text-neutral">ADMIN SIGN IN</h1>
                    <form className="max-w-sm mx-auto mt-4" onSubmit={handleSubmit(onSubmit)}>
                        <input type="text"
                            className="input input-bordered input-neutral w-full"
                            id="admin_name"
                            aria-invalid={errors.name ? "true" : "false"}
                            {...register("name", { required: true })}
                            placeholder="johndoe" />
                        {!!errors.name &&
                            <p role="alert" className="text-red-500 text-xs italic">Please fill out this field.</p>
                        }
                        <input type="password"
                            className="input input-bordered input-neutral w-full"
                            id="password"
                            aria-invalid={errors.password ? "true" : "false"}
                            {...register("password", { required: true })}
                            placeholder="Password" />
                        {!!errors.password &&
                            <p role="alert" className="text-red-500 text-xs italic">Please choose a password.</p>
                        }
                        <button className='btn btn-block btn-neutral'>SIGN IN</button>
                        <div className="text-center pt-4">
                            <span className="text-sm text-neutral/80">Dont have an account?</span> <Link className="underline" to="/register/admin">CREATE ACCOUNT</Link>
                        </div>
                    </form>
                </div>
            </div>
            <footer className="w-full bg-transparent my-4">
                <div className="w-full mx-auto p-4 md:flex md:items-center md:justify-end md:gap-6">
                    <span className="text-xs text-neutral/90 sm:text-center">
                        © 2023 Samuel Oluwade
                    </span>
                    <ul className="flex flex-wrap items-center mt-3 text-xs font-medium text-neutral/50 sm:mt-0">
                        <li>
                            <a target="_blank" href="https://github.com/s-oluwade" className="mr-4 hover:underline md:mr-6 flex items-center">
                                Github
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a target="_blank" href="https://www.cookiepolicygenerator.com/live.php?token=13A7pWhd9KInJXDPINssDYTkGQ2Q5ghI" className="mr-4 hover:underline md:mr-6 flex items-center">
                                Cookie Policy
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                </svg>

                            </a>
                        </li>
                    </ul>
                </div>
            </footer>
        </div>
    );
}

export default LoginAdminPage;