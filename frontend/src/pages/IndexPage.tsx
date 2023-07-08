import { Link } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
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
                                <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
                                <p className="mb-5">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                                <Link to="/login/user"><button className="btn btn-active btn-accent mx-2">Login as User</button></Link>
                                <Link to="/login/admin"><button className="btn btn-active btn-neutral mx-2">Login as Admin</button></Link>
                            </div>
                        </div>
                    </div>
                </div> :
                <section className="w-full bg-center bg-no-repeat bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/conference.jpg')] bg-gray-700 bg-blend-multiply">
                    <div className="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56">
                        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">We invest in the world’s potential</h1>
                        <p className="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">Here at Flowbite we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth.</p>
                        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                            {showLogin ?
                                <>
                                    <Link to="/login/user"><button className="btn btn-active btn-accent">Login as User</button></Link>
                                    <Link to="/login/admin"><button className="btn btn-active btn-neutral">Login as Admin</button></Link>
                                </> :
                                <>
                                    <a onClick={() => setShowLogin(!showLogin)} className="btn btn-primary normal-case text-base font-medium">
                                        Get started
                                        <svg aria-hidden="true" className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                    </a>
                                    <a href="#" className="btn btn-glass normal-case text-base font-medium">
                                        Learn more
                                    </a>
                                </>
                            }
                        </div>
                    </div>
                </section>

            }
        </>
    );
}

export default IndexPage;