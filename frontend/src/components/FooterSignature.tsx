const FooterSignature = () => {
    return (
        <footer className='absolute left-0 bottom-0 my-2 w-full bg-transparent'>
            <div className='flex w-full items-center justify-start p-4 gap-6'>
                <span className='text-xs'>© 2023 Samuel Oluwade</span>
                <ul className='flex flex-wrap text-xs font-medium mt-0'>
                    <li>
                        <a
                            target='_blank'
                            href='https://github.com/s-oluwade/marstourist'
                            className='flex hover:underline'
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
    );
};

export default FooterSignature;
