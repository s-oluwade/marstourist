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
        <div className="flex flex-col mx-auto">
            <div className="mt-4 grow flex items-center justify-around">
                <div className="mb-24 p-8 border rounded-2xl shadow-2xl bg-base-100">
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

export default SignUpUserPage;