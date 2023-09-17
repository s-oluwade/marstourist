import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext } from "react";
import { GlobalContext } from "./Providers/GlobalContextProvider";

interface ConfirmationModalProps {
    title: string;
    message: string;
}

export default function ConfirmationModal({ title, message }: ConfirmationModalProps) {

    const { setModalResponse, showConfirmationModal, setShowConfirmationModal } = useContext(GlobalContext);

    return (
        <>
            <Transition appear show={showConfirmationModal} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => { setShowConfirmationModal(false); }}>
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
                                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl leading-6 bg-gray-100 dark:bg-gray-700 p-4 align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="py-4 text-xl font-medium"
                                    >
                                        {title}
                                    </Dialog.Title>
                                    <Dialog.Description className="py-2 text-lg">
                                        {message}
                                    </Dialog.Description>
                                    <div className="py-4 flex justify-center gap-2">
                                        <button
                                            type="button"
                                            className="btn sm:btn-sm md:btn-md w-24 btn-accent"
                                            onClick={() => { setModalResponse(title); setShowConfirmationModal(false) }}
                                        >
                                            Yes
                                        </button>
                                        <button
                                            type="button"
                                            className="btn sm:btn-sm md:btn-md btn-ghost"
                                            onClick={() => { setModalResponse("dismiss"); setShowConfirmationModal(false) }}
                                        >
                                            Cancel
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