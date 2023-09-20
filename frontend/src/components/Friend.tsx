import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../models/user';
import { AuthContext } from './Providers/AuthContextProvider';

interface FriendsProps {
    peer: User;
}

const Friend = ({ peer }: FriendsProps) => {
    
    const {user} = useContext(AuthContext)


    if (!peer) return;
    
    return (
        <div
            data-id={peer._id}
            className='flex justify-between bg-base-100 px-4 py-2 dark:bg-gray-900'
        >
            <Link to={`/${peer.username === user?.username ? 'profile': 'peer'}/`+peer.username} className='flex items-center gap-2 hover:link'>
                <div className='avatar'>
                    <div className='w-8 rounded-full'>
                        {
                            <img
                                src={
                                    peer.thumbnail ??
                                    'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010'
                                }
                            />
                        }
                    </div>
                </div>
                <div className='text-sm'>{peer.fullname}</div>
            </Link>
            {/* <div className='flex items-center'>
                <AddFriend id={user._id} />
            </div> */}
        </div>
    );
};

export default Friend;
