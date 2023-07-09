import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext } from "react";
import { GlobalContext } from "./Providers/GlobalContext";

interface DeleteConfirmationModal {
    title: string;
    message: string;
}

export default function DeleteConfirmationModal({ title, message }: DeleteConfirmationModal) {

    const { setModalResponse, showDeleteModal, setShowDeleteModal } = useContext(GlobalContext);

    return (
        <>
            <Transition appear show={showDeleteModal} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => { setShowDeleteModal(false); }}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl leading-6 bg-white p-4 align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="py-2 text-lg font-medium text-gray-900"
                                    >
                                        {title}
                                    </Dialog.Title>
                                    <Dialog.Description className="py-2">
                                        {message}
                                    </Dialog.Description>
                                    <div className="py-2 flex justify-center gap-16">
                                        <button
                                            type="button"
                                            className="rounded-md border border-transparent bg-blue-200 px-8 py-2 text-sm font-medium text-black-900 hover:bg-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={() => { setModalResponse(title); setShowDeleteModal(false) }}
                                        >
                                            Yes
                                        </button>
                                        <button
                                            type="button"
                                            className="rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                            onClick={() => { setShowDeleteModal(false) }}
                                        >
                                            No
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}