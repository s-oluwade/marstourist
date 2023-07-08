import { Link } from "react-router-dom";

const LoginPage = () => {


    return (
        <div className="flex w-full items-center justify-center">
            <div className="flex -mt-36 gap-10">
                <Link to="/login/user"><button className="btn btn-active btn-accent">Login as User</button></Link>
                <Link to="/login/admin"><button className="btn btn-active btn-neutral">Login as Admin</button></Link>
            </div>
        </div>
    );
}

export default LoginPage;