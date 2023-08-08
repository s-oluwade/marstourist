import { Link } from 'react-router-dom';

const LoginPage = () => {
    return (
        <div className='flex w-full items-center justify-center'>
            <div className='-mt-36 flex gap-10'>
                <Link to='/login/user'>
                    <button className='btn-accent btn-active btn'>Login as User</button>
                </Link>
                <Link to='/login/admin'>
                    <button className='btn-neutral btn-active btn'>Login as Admin</button>
                </Link>
            </div>
        </div>
    );
};

export default LoginPage;
