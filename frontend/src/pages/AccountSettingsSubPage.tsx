import { Link } from "react-router-dom";
import { GlobalContext } from "../components/GlobalContext";
import { useContext, useEffect } from "react";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

export default function AccountSettingsSubPage() {
    const { modalResponse, setModalResponse, setShowDeleteModal } = useContext(GlobalContext);

    const message="Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone.";

    useEffect(() => {
        if (modalResponse == "Delete Account") {
            // do post request to delete account
            setModalResponse("");
            console.log("account deleted");
        }
    }, [modalResponse, setModalResponse])

    return (
        <div className="underline text-red-500 flex justify-center text-md mt-5">
            <Link onClick={() => setShowDeleteModal(true)} to="#">Delete Account
            </Link>
            <DeleteConfirmationModal message={message} title="Delete Account" />
        </div>
    )
}
