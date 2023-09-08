import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface Props {
    images: { title: string; url: string }[];
    isOpen: boolean;
    onClose: (arg0: boolean) => void;
}

const ImageSliderModal = ({ images, isOpen, onClose }: Props) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    console.log(currentIndex);
    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    return (
        <div
            className={`${
                isOpen ? 'block' : 'hidden'
            } fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`}
        >
            <div className='relative bg-white'>
                <button
                    className='absolute -right-8 -top-6 text-base-100'
                    onClick={() => onClose(false)}
                >
                    <XMarkIcon className='h-9 w-9' aria-hidden='true' />
                </button>
                <div className='max-w-7xl'>
                    <img src={images[currentIndex].url} alt={`Image ${currentIndex}`} />
                </div>
                <div className='mt-2 flex justify-center gap-4'>
                    <button
                        className={`btn-info btn-outline btn ${currentIndex === 0 && 'invisible'}`}
                        onClick={handlePrev}
                    >
                        Previous
                    </button>
                    <button
                        className={`btn-info btn-outline btn ${
                            currentIndex === images.length - 1 && 'invisible'
                        }`}
                        onClick={handleNext}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageSliderModal;
