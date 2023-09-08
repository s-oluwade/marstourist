import { useState } from 'react';

interface Props {
    images: string[];
    isOpen: boolean;
    onClose: () => void;
}

const ImageSliderModal = ({ images, isOpen, onClose }: Props) => {
    const [currentIndex, setCurrentIndex] = useState(0);

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
            <div className='relative rounded-lg bg-white p-4'>
                <button
                    className='absolute right-2 top-2 text-gray-500 hover:text-gray-700'
                    onClick={onClose}
                >
                    Close
                </button>
                <div className='h-64 w-64'>
                    <img src={images[currentIndex]} alt={`Image ${currentIndex}`} />
                </div>
                <div className='mt-2 flex justify-between'>
                    <button className='text-gray-500 hover:text-gray-700' onClick={handlePrev}>
                        Previous
                    </button>
                    <button className='text-gray-500 hover:text-gray-700' onClick={handleNext}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageSliderModal;
