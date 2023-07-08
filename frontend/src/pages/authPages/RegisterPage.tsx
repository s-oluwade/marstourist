import { Link } from "react-router-dom";

const RegisterPage = () => {
    return (
        <div className="flex w-full items-center justify-center">
            <div className="flex -mt-36 gap-10">
                <Link to="/register/user"><button className="btn btn-active btn-accent">Register as User</button></Link>
                <Link to="/register/admin"><button className="btn btn-active btn-neutral">Register as Admin</button></Link>
            </div>
        </div>
    );
}

export default RegisterPage;