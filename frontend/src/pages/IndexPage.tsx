import { Link } from "react-router-dom";
import { AuthContext } from "../components/Providers/AuthContext";
import { useContext, useState } from 'react';

const IndexPage = () => {
    const { loadingAdmin, admin, loadingUser, user } = useContext(AuthContext);
    const [showLogin, setShowLogin] = useState(false);

    return (
        <>
            {(!loadingUser && !user && !loadingAdmin && !admin) ?
                <div className="flex w-full items-center justify-center bg-gray-300">
                    <div className="hero min-h-full">
                        <div className="hero-overlay bg-opacity-60"></div>
                        <div className="hero-content text-center text-neutral-content">
                            <div className="max-w-md -mt-20">
                                <h1 className="mb-5 text-5xl font-bold">Welcome to Mars!</h1>
                                <div className="mb-5">
                                    <p >Here on the red planet you will find others visitors hailing from different parts of the Galaxy!
                                    <br />To get started, click the link below to read their feeds or sign in to visit our store!</p>
                                </div>
                                {showLogin ?
                                    <div className="flex justify-center gap-6">
                                        <Link to="/login/user"><button className="btn btn-active btn-accent">Sign In as User</button></Link>
                                        <Link to="/login/admin"><button className="btn btn-active btn-neutral">Sign In as Admin</button></Link>
                                    </div> :
                                    <div className="flex justify-center gap-6">
                                        <a onClick={() => setShowLogin(!showLogin)} className="btn btn-accent normal-case text-base font-medium">
                                            Sign In
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </a>
                                        <Link to={'/feeds'} className="btn btn-glass normal-case text-base font-medium">
                                            See Martian Feeds
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                            </svg>
                                        </Link>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div> :
                <section className="w-full bg-center bg-no-repeat bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/conference.jpg')] bg-gray-700 bg-blend-multiply">
                    <div className="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56">
                        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">Welcome to Mars!</h1>
                        <div className="mb-5">
                            <p className="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">Here on the red planet you will find others visitors hailing from different parts of the Galaxy!
                                <br />To get started, click the link below to read their feeds or visit our store!</p>
                        </div>
                        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                            <Link to={'/store'} className="btn btn-accent normal-case text-base font-medium">
                                Visit Store
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                            </Link>
                            <Link to={'/feeds'} className="btn btn-glass normal-case text-base font-medium">
                                See Martian Feeds
                                <svg aria-hidden="true" className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            </Link>
                        </div>
                    </div>
                </section>
            }
        </>
    );
}

export default IndexPage;