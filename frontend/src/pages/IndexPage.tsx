import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/Providers/AuthContextProvider';
import ImageSliderModal from '../components/ImageSliderModal';

const previewImages = [
    {
        title: '',
        url: 'https://storage.googleapis.com/neat-tempo-393404.appspot.com/marstourist-preview-images/marstourist2.png',
    },
    {
        title: '',
        url: 'https://storage.googleapis.com/neat-tempo-393404.appspot.com/marstourist-preview-images/marstourist3.png',
    },
    {
        title: '',
        url: 'https://storage.googleapis.com/neat-tempo-393404.appspot.com/marstourist-preview-images/marstourist4.png',
    },
    {
        title: '',
        url: 'https://storage.googleapis.com/neat-tempo-393404.appspot.com/marstourist-preview-images/marstourist5.png',
    },
    {
        title: '',
        url: 'https://storage.googleapis.com/neat-tempo-393404.appspot.com/marstourist-preview-images/marstourist6.png',
    },
    {
        title: '',
        url: 'https://storage.googleapis.com/neat-tempo-393404.appspot.com/marstourist-preview-images/marstourist7.png',
    },
    {
        title: '',
        url: 'https://storage.googleapis.com/neat-tempo-393404.appspot.com/marstourist-preview-images/marstourist8.png',
    },
    {
        title: '',
        url: 'https://storage.googleapis.com/neat-tempo-393404.appspot.com/marstourist-preview-images/marstourist9.png',
    },
];

const IndexPage = () => {
    const { loadingAdmin, admin, loadingUser, user } = useContext(AuthContext);
    const [showLogin, setShowLogin] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const navigate = useNavigate();

    function reviewPermissions() {
        if (import.meta.env.VITE_ADMIN_ACCESS_DENIED === 'true') {
            showToolTip();
        } else {
            navigate('/login/admin');
        }
    }

    function handlePreviewModal(show: boolean) {
        setShowPreviewModal(show);
    }

    function showToolTip() {
        const adminLoginLink = document.getElementById('admin-login-link');
        adminLoginLink?.setAttribute('data-tip', 'Access Denied');
    }

    return (
        <section className="w-full bg-gray-700 bg-[url('https://images.unsplash.com/photo-1573588028698-f4759befb09a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80')] bg-cover bg-center bg-blend-multiply">
            <ImageSliderModal
                images={previewImages}
                isOpen={showPreviewModal}
                onClose={handlePreviewModal}
            />
            <div className='mx-auto -mt-16 flex h-full max-w-screen-xl flex-col justify-center px-4 py-24 text-center md:py-56'>
                <div className='mb-12 w-full text-center'>
                    <button
                        className='btn-info btn-wide btn'
                        onClick={() => setShowPreviewModal(true)}
                    >
                        Click here to Quick Preview
                    </button>
                </div>
                <h1 className='text-4xl font-bold leading-none tracking-tight text-accent md:text-5xl lg:text-6xl'>
                    Welcome to Mars!
                </h1>
                <div className='my-14'>
                    <p className='text-lg text-neutral-content sm:px-16 lg:px-48'>
                        Here on the red planet you will find others visitors hailing from different
                        parts of the Galaxy.
                    </p>
                    <p className='text-lg text-neutral-content sm:px-16 lg:px-48'>
                        Get yourself prepared for the harsh Martian climate by grabbing items from
                        our store, or visit the forum to connect with other Martians.
                    </p>
                    {!user && (
                        <>
                            <br />
                            <p className='text-lg text-neutral-content sm:px-16 lg:px-48'>
                                Sign in to access full site!
                            </p>
                        </>
                    )}
                </div>

                {!loadingUser && !user && !loadingAdmin && !admin ? (
                    showLogin ? (
                        <div className='flex flex-col items-center space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0'>
                            <a className='link-accent link' onClick={() => setShowLogin(false)}>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth={1.5}
                                    stroke='currentColor'
                                    className='h-6 w-6'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        d='M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3'
                                    />
                                </svg>
                            </a>
                            <Link to='/login/user'>
                                <button className='btn-accent btn text-base font-medium normal-case'>
                                    Sign In as USER
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        strokeWidth={1.5}
                                        stroke='currentColor'
                                        className='h-6 w-6'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            d='M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z'
                                        />
                                    </svg>
                                </button>
                            </Link>
                            <a
                                id='admin-login-link'
                                className='tooltip-close tooltip tooltip-top'
                                data-tip='Restricted Access'
                            >
                                <button
                                    onClick={reviewPermissions}
                                    className='btn-neutral btn text-base font-medium normal-case'
                                >
                                    Sign In as ADMIN
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        strokeWidth={1.5}
                                        stroke='currentColor'
                                        className='h-6 w-6'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            d='M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z'
                                        />
                                    </svg>
                                </button>
                            </a>
                        </div>
                    ) : (
                        <div className='flex justify-center gap-6'>
                            <a
                                onClick={() => setShowLogin(true)}
                                className='btn-accent btn text-base font-medium normal-case'
                            >
                                Sign In
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth={1.5}
                                    stroke='currentColor'
                                    className='h-6 w-6'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        d='M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z'
                                    />
                                </svg>
                            </a>
                            <Link
                                to={'/forum'}
                                className='btn-glass btn text-base font-medium normal-case dark:btn-neutral'
                            >
                                See Martian Forum
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth={1.5}
                                    stroke='currentColor'
                                    className='h-6 w-6'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        d='M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z'
                                    />
                                </svg>
                            </Link>
                        </div>
                    )
                ) : (
                    <div className='flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0'>
                        <Link
                            to={'/store'}
                            className='btn-accent btn text-base font-medium normal-case'
                        >
                            Visit Store
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth={1.5}
                                stroke='currentColor'
                                className='h-6 w-6'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
                                />
                            </svg>
                        </Link>
                        <Link
                            to={'/forum'}
                            className='btn-glass btn text-base font-medium normal-case dark:btn-neutral'
                        >
                            See Martian Forum
                            <svg
                                aria-hidden='true'
                                className='-mr-1 ml-2 h-4 w-4'
                                fill='currentColor'
                                viewBox='0 0 20 20'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    fillRule='evenodd'
                                    d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
                                    clipRule='evenodd'
                                ></path>
                            </svg>
                        </Link>
                    </div>
                )}
            </div>
            <footer className='w-full bg-transparent'>
                <div className='w-full pl-6 md:flex md:items-center md:justify-end md:gap-6'>
                    <span className='text-xs text-neutral-content/50 sm:text-center'>
                        © 2023 Samuel Oluwade
                    </span>
                    <ul className='flex flex-wrap items-center text-xs font-medium text-neutral-content/40 sm:mt-0'>
                        <li>
                            <a
                                target='_blank'
                                href='https://github.com/s-oluwade'
                                className='mr-4 flex items-center hover:underline md:mr-6'
                            >
                                Github
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth={1.5}
                                    stroke='currentColor'
                                    className='h-4 w-4'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        d='M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25'
                                    />
                                </svg>
                            </a>
                        </li>
                    </ul>
                </div>
            </footer>
        </section>
    );
};

export default IndexPage;
