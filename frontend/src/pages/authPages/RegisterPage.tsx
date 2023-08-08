import { Link } from 'react-router-dom';

const RegisterPage = () => {
    return (
        <div className='flex w-full items-center justify-center'>
            <div className='-mt-36 flex gap-10'>
                <Link to='/register/user'>
                    <button className='btn-accent btn-active btn'>Register as User</button>
                </Link>
                <Link to='/register/admin'>
                    <button className='btn-neutral btn-active btn'>Register as Admin</button>
                </Link>
            </div>
        </div>
    );
};

export default RegisterPage;
