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
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-32 p-8 border rounded-2xl shadow-2xl bg-base-100">
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
                        <span className="text-gray-400">Dont have an account?</span> <Link className="underline" to="/register/admin">CREATE ACCOUNT</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginAdminPage;