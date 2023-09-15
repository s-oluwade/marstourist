import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../components/Providers/AuthContextProvider';
import { UserContext } from '../../components/Providers/UserContextProvider';

const PurchasedSubPage = () => {
    const [purchased, setPurchased] = useState<Purchased[] | null>(null);
    const { setUserNotifications } = useContext(UserContext);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        (async function getPurchase() {
            const { data } = await axios.get<Purchased[]>('/sales/purchase');
            setPurchased(data);
        })();

        async function removeNotification(id: string) {
            axios
                .put('/notifications/remove/' + id, ['purchase'], {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then((response) => {
                    if (response.data) setUserNotifications(response.data);
                });
        }
        if (user) {
            removeNotification(user._id);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setUserNotifications, user]);

    if (import.meta.env.ENVIRONMENT === 'production') {
        return <div>Page is currently under maintenance.</div>;
    }

    return (
        <div className='py-6 md:max-h-[49.5rem] md:overflow-y-auto'>
            <div className='grid grid-cols-2 gap-4 px-10 md:grid-cols-3'>
                {purchased ?
                    purchased.map((purchase, index) => {
                        return (
                            <div key={index}>
                                <div className='mb-2 h-48'>
                                    <img
                                        className='h-full w-full rounded-lg object-cover'
                                        src={purchase.imageUrl}
                                        alt=''
                                    />
                                </div>
                                <div className='space-x-2'>
                                    <span>{purchase.title}</span>
                                    <span className='badge badge-outline'>{purchase.quantity}</span>
                                </div>
                            </div>
                        );
                    }): <div>Nothing yet</div>}
            </div>
        </div>
    );
};

export default PurchasedSubPage;
