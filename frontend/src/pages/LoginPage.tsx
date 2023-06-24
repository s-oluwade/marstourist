import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { LoginCredentials } from "../network/api";
import * as Api from "../network/api";
import { useForm } from "react-hook-form";

const LoginPage = () => {
    const [redirect, setRedirect] = useState(false);
    const { setUserObject } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>();

    async function onSubmit(credentials: LoginCredentials) {
        try {
            setUserObject(await Api.login(credentials));
            setRedirect(true);
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
            <div className="mb-32 p-8 border rounded-2xl shadow-2xl">
                <h1 className="text-4xl text-center">Login</h1>
                <form className="max-w-sm mx-auto mt-4" onSubmit={handleSubmit(onSubmit)}>
                    <input type="email"
                        className="input input-bordered input-primary w-full max-w-xs"
                        id="email"
                        aria-invalid={errors.email ? "true" : "false"}
                        {...register("email", { required: true })}
                        placeholder="your@email.com" />
                    {!!errors.email &&
                        <p role="alert" className="text-red-500 text-xs italic">Please fill out this field.</p>
                    }
                    <input type="password"
                        className="input input-bordered input-primary w-full max-w-xs"
                        id="password"
                        aria-invalid={errors.password ? "true" : "false"}
                        {...register("password", { required: true })}
                        placeholder="Password" />
                    {!!errors.password &&
                        <p role="alert" className="text-red-500 text-xs italic">Please choose a password.</p>
                    }
                    <button className={`p-2 w-full rounded-xl`}>Login</button>
                    <div className="text-center pt-4">
                        <span className="text-gray-400">Dont have an account?</span> <Link className="underline" to="/signup">Sign up</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;