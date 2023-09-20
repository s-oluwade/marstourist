import { useContext } from "react";
import { AuthContext } from "../../components/Providers/AuthContextProvider";
import Friend from "../../components/Friend";
import { GlobalContext } from "../../components/Providers/GlobalContextProvider";

const FriendsPage = () => {
    const { user } = useContext(AuthContext);
    const { allUsers } = useContext(GlobalContext);
    
    return (
    <div className='m-4 min-w-[12.5rem] bg-base-100 rounded dark:bg-gray-900'>
        <h3 className='text-md p-4 font-normal'>
            Friends ({user?.friends ? user.friends.length : 0})
        </h3>
        <div>
            {user?.friends?.map((friend) => <Friend key={friend.userId} peer={allUsers.filter((each) => each._id === friend.userId)[0]} />)}
        </div>
    </div>
    );
}

export default FriendsPage;