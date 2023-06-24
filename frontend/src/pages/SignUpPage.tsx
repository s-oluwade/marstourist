import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { useContext, useState } from "react";
import { SignUpCredentials } from "../network/api";
import * as Api from "../network/api";
import { useForm } from "react-hook-form";

const SignUpPage = () => {
    const [fullname, setFullname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false);

    const { setUserObject } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm<SignUpCredentials>();

    async function onSubmit(credentials: SignUpCredentials) {
        try {
            const newUserObject = await Api.signUp(credentials);
            setUserObject(newUserObject);
            setRedirect(true);
        } catch (error) {
            alert("Registration failed");
            console.error(error);
        }
    }

    if (redirect) {
        return <Navigate to={'/account'} />
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-32 p-8 border rounded-2xl shadow-2xl">
                <h1 className="text-4xl text-center">Sign up</h1>
                <form className="max-w-sm mx-auto mt-4" onSubmit={handleSubmit(onSubmit)}>
                    <input type="text"
                        id="fullname"
                        className="w-full border border-primary my-1 py-2 px-3 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        value={fullname}
                        aria-invalid={errors.fullname ? "true" : "false"}
                        {...register("fullname", { required: true })}
                        onChange={e => setFullname(e.target.value)}
                        placeholder="John Doe" />
                    {!!errors.fullname &&
                        <p role="alert" className="alert text-red-900 text-xs italic">Please fill out this field.</p>
                    }
                    <input type="text"
                        id="username"
                        value={username}
                        {...register("username", { required: false })}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="username (optional)" />
                    <input type="email"
                        id="email"
                        className="w-full border border-primary my-1 py-2 px-3 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
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
                        className="w-full border border-primary my-1 py-2 px-3 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        value={password}
                        aria-invalid={errors.password ? "true" : "false"}
                        {...register("password", { required: true })}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password" />
                    {!!errors.password &&
                        <p role="alert" className="alert text-red text-xs italic">Please choose a password.</p>
                    }
                    <button className={`p-2 w-full text-white rounded-xl`}>Sign up</button>
                    <div className="text-center pt-4">
                        <span className="text-gray-400">Already a member?</span> <Link className="underline" to="/login">Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUpPage;