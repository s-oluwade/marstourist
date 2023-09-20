import { useContext } from "react";
import { AuthContext } from "../../components/Providers/AuthContextProvider";
import Friend from "../../components/Friend";

const FriendsPage = () => {
    const { user } = useContext(AuthContext);
    
    return (
    <div className='m-4 min-w-[12.5rem] bg-base-100 rounded dark:bg-gray-900'>
        <h3 className='text-md p-4 font-normal'>
            Friends ({user?.friends ? user.friends.length : 0})
        </h3>
        <div>
            {user?.friends?.map((friend) => <Friend key={friend} user={user} />)}
        </div>
    </div>
    );
}

export default FriendsPage;