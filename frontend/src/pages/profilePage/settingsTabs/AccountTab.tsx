import { Link } from "react-router-dom";
import { GlobalContext } from "../../../components/Providers/GlobalContext";
import { useContext, useEffect } from "react";
import ConfirmationModal from "../../../components/ConfirmationModal";
import axios from "axios";

export default function AccountSettingsSubPage() {
    const { modalResponse, setModalResponse, setShowConfirmationModal } = useContext(GlobalContext);
    const message="Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone.";

    useEffect(() => {
        if (modalResponse == "Delete Account") {
            // do post request to delete account
            setModalResponse("");

            axios.post('/user/delete-account')
            .then(response => {
                if (response.status == 202) {
                    window.location.reload();
                }
            })
            .catch(error => {
                console.log(error);
            })

            
        }
    }, [modalResponse, setModalResponse])

    return (
        <div className="underline text-red-500 flex justify-center text-md mt-5">
            <Link onClick={() => setShowConfirmationModal(true)} to="#">Delete Account
            </Link>
            <ConfirmationModal message={message} title="Delete Account" />
        </div>
    )
}
