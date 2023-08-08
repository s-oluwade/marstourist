import axios from 'axios';
import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { GlobalContext } from '../../../components/Providers/GlobalContext';

export default function AccountSettingsSubPage() {
    const { modalResponse, setModalResponse, setShowConfirmationModal } = useContext(GlobalContext);
    const message =
        'Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone.';

    useEffect(() => {
        if (modalResponse == 'Delete Account') {
            // do post request to delete account
            setModalResponse('');

            axios
                .post('/user/delete-account')
                .then((response) => {
                    if (response.status == 202) {
                        window.location.reload();
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [modalResponse, setModalResponse]);

    return (
        <div className='text-md mt-5 flex justify-center text-red-500 underline'>
            <Link onClick={() => setShowConfirmationModal(true)} to='#'>
                Delete Account
            </Link>
            <ConfirmationModal message={message} title='Delete Account' />
        </div>
    );
}
