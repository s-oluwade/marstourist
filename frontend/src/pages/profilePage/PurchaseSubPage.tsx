import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../components/Providers/AuthContextProvider';
import { Purchase } from '../../models/purchase';

const PurchaseSubPage = () => {
    const [purchase, setPurchase] = useState<Purchase[] | null>(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        (async function getPurchase() {
            const { data } = await axios.get<Purchase[]>('/sales/purchase');
            setPurchase(data);
        })();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    if (import.meta.env.ENVIRONMENT === 'production') {
        return <div>Page is currently under maintenance.</div>;
    }

    return (
        <div className='py-6 md:max-h-[49.5rem] md:overflow-y-auto'>
            <div className='grid grid-cols-2 gap-4 px-10 md:grid-cols-3'>
                {purchase &&
                    purchase.map((purchase, index) => {
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
                    })}
            </div>
        </div>
    );
};

export default PurchaseSubPage;
