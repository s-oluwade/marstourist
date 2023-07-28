import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../../components/Providers/AuthContext";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { User } from "../../models/user";

interface RegisterCredentials {
    fullname: string,
    username: string,
    email: string,
    password: string,
}

const SignUpUserPage = () => {
    const [fullname, setFullname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false);

    const { setUser } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterCredentials>();

    async function onSubmit(credentials: RegisterCredentials) {
        try {
            const response = await axios.post<User>("/user/register", credentials, { headers: { "Content-Type": "application/json" } });
            setUser(response.data);
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
            <div className="mb-32 p-8 border rounded-2xl shadow-2xl bg-base-100">
                <h1 className="text-2xl font-medium text-center text-accent">CREATE ACCOUNT</h1>
                <form className="max-w-sm mx-auto mt-4" onSubmit={handleSubmit(onSubmit)}>
                    <input type="text"
                        id="fullname"
                        className="input input-bordered input-accent w-full"
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
                        className="input input-bordered input-accent w-full"
                        value={username}
                        {...register("username", { required: false })}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="username (optional)" />
                    <input type="email"
                        id="email"
                        className="input input-bordered input-accent w-full"
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
                        className="input input-bordered input-accent w-full"
                        value={password}
                        aria-invalid={errors.password ? "true" : "false"}
                        {...register("password", { required: true })}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password" />
                    {!!errors.password &&
                        <p role="alert" className="alert text-red text-xs italic">Please choose a password.</p>
                    }
                    <button className='btn btn-block btn-accent'>CREATE ACCOUNT</button>
                    <div className="text-center pt-4">
                        <span className="text-sm text-neutral/80">Already a member?</span> <Link className="underline" to="/login/user">Sign In</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUpUserPage;