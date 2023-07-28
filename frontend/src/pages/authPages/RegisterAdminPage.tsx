import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../../components/Providers/AuthContext";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Admin } from "../../models/admin";

export interface AdminRegisterCredentials {
    name: string,
    password: string,
    email: string,
}

const RegisterAdminPage = () => {
    const [adminName, setAdminName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false);
    const { setAdmin } = useContext(AuthContext);

    const { register, handleSubmit, formState: { errors } } = useForm<AdminRegisterCredentials>();

    async function onSubmit(credentials: AdminRegisterCredentials) {
        try {
            const response = await axios.post<Admin>("/admin/register", credentials, { headers: { "Content-Type": "application/json" } });
            setAdmin(response.data);
            
            setRedirect(true);
        } catch (error) {
            alert("Registration failed");
            console.error(error);
        }
    }

    if (redirect) {
        return <Navigate to={'/dashboard'} />
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-32 p-8 border rounded-2xl shadow-2xl bg-base-100">
                <h1 className="text-2xl font-medium text-center text-neutral">ADMIN CREATE ACCOUNT</h1>
                <form className="max-w-sm mx-auto mt-4" onSubmit={handleSubmit(onSubmit)}>
                    <input type="text"
                        id="admin-name"
                        className="input input-bordered input-neutral w-full"
                        value={adminName}
                        {...register("name", { required: false })}
                        onChange={e => setAdminName(e.target.value)}
                        placeholder="johndoe" />
                    <input type="email"
                        id="email"
                        className="input input-bordered input-neutral w-full"
                        value={email}
                        aria-invalid={errors.email ? "true" : "false"}
                        {...register("email", { required: true })}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="your@email.com" />
                    {!!errors.email &&
                        <p role="alert" className="alert text-red-900 text-xs italic">Please fill out this field.</p>
                    }
                    <input type="password"
                        id="password"
                        className="input input-bordered input-neutral w-full"
                        value={password}
                        aria-invalid={errors.password ? "true" : "false"}
                        {...register("password", { required: true })}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password" />
                    {!!errors.password &&
                        <p role="alert" className="alert text-red text-xs italic">Please choose a password.</p>
                    }
                    <button className='btn btn-block btn-neutral'>CREATE ACCOUNT</button>
                    <div className="text-center pt-4">
                        <span className="text-sm text-neutral/80">Already a member?</span> <Link className="underline" to="/login/admin">SIGN IN</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterAdminPage;