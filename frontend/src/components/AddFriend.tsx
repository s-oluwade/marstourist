import axios from 'axios';
import { useContext } from 'react';
import { User } from '../models/user';
import { AuthContext } from './Providers/AuthContextProvider';

interface Props {
    id: string;
}

const AddFriend = ({ id }: Props) => {
    const { user, setUser } = useContext(AuthContext);

    // use id to find user avatar
    function updateFriendship(friendId: string) {
        axios
            .put<User>(
                '/user/update-friendship',
                { friendId },
                { headers: { 'Content-Type': 'application/json' } }
            )
            .then((res) => {
                if (res.data) {
                    setUser(res.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }

    if (!user) return;

    return (
        <button
            className={`btn-sm btn ${
                user.friends.filter((friend) => friend.userId === id).length !== 0
                    ? 'btn-accent'
                    : 'btn-neutral'
            }`}
            title={
                user.friends.filter((friend) => friend.userId === id).length === 0
                    ? 'Add Friend'
                    : 'Remove Friend'
            }
        >
            <label className='swap'>
                {/* this hidden checkbox controls the state */}
                <input
                    type='checkbox'
                    checked={user.friends.filter((friend) => friend.userId === id).length !== 0}
                    onChange={(e) => {
                        e.currentTarget.checked = !e.currentTarget.checked;
                        updateFriendship(id);
                    }}
                />
                <svg
                    className='swap-on h-4 w-4'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12.75l6 6 9-13.5' />
                </svg>
                {/* add user icon */}
                <svg
                    className='swap-off h-4 w-4'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z'
                    />
                </svg>
                <span className='ml-6 leading-4'>
                    {user.friends.filter((friend) => friend.userId === id).length === 0
                        ? 'Add Friend'
                        : 'Friends'}
                </span>
            </label>
        </button>
    );
};

export default AddFriend;
