import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../../components/Providers/AuthContext";
import { useForm } from "react-hook-form";
import { User } from "../../models/user";
import axios from "axios";

interface LoginCredentials {
    email: string,
    password: string,
}

const LoginUserPage = () => {
    const [redirect, setRedirect] = useState(false);
    const { setUser } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>();

    async function onSubmit(credentials: LoginCredentials) {
        try {
            const response = await axios.post<User>("/user/login", credentials, { headers: { "Content-Type": "application/json" } });
            console.log(response.headers);
            console.log(document.cookie);
            setUser(response.data);
            // setRedirect(true);
        } catch (error) {
            alert("Login failed");
            console.error(error);
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-32 p-8 border rounded-2xl shadow-2xl bg-base-100">
                <h1 className="text-2xl font-medium text-center text-accent">SIGN IN</h1>
                <form className="max-w-sm mx-auto mt-4" onSubmit={handleSubmit(onSubmit)}>
                    <input type="email"
                        className="input input-bordered input-accent w-full"
                        id="email"
                        aria-invalid={errors.email ? "true" : "false"}
                        {...register("email", { required: true })}
                        placeholder="your@email.com" />
                    {!!errors.email &&
                        <p role="alert" className="text-red-500 text-xs italic">Please fill out this field.</p>
                    }
                    <input type="password"
                        className="input input-bordered input-accent w-full"
                        id="password"
                        aria-invalid={errors.password ? "true" : "false"}
                        {...register("password", { required: true })}
                        placeholder="Password" />
                    {!!errors.password &&
                        <p role="alert" className="text-red-500 text-xs italic">Please choose a password.</p>
                    }
                    <button className='btn btn-block btn-accent'>Sign In</button>
                    <div className="text-center pt-4">
                        <span className="text-gray-400">Dont have an account?</span> <Link className="underline" to="/register/user">Create Account</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginUserPage;