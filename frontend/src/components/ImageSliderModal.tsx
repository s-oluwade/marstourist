import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useRef, useCallback } from 'react';

interface Props {
    images: { title: string; url: string }[];
    isOpen: boolean;
    onClose: (arg0: boolean) => void;
}

const ImageSliderModal = ({ images, isOpen, onClose }: Props) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    // let keyDown: string | undefined = undefined;
    const keyDown = useRef<string | undefined>();

    const handleNext = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, [images.length]);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    }, [images.length]);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        keyDown.current = event.key;
    }, []);

    const handleKeyUp = useCallback((event: KeyboardEvent) => {
        if (keyDown.current === event.key) {
            console.log(currentIndex)
            console.log(event.key)
            if (event.key === 'ArrowLeft' && currentIndex !== 0) {
                console.log('Left Triggered');
                handlePrev();
            } else if (event.key === 'ArrowRight' && currentIndex !== images.length - 1) {
                console.log('Right Triggered');
                handleNext();
            }
            keyDown.current = undefined;
        }
    }, [currentIndex, handleNext, handlePrev, images.length]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);

    return (
        <div
            className={`${
                isOpen ? 'block' : 'hidden'
            } fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`}
        >
            <div className='relative bg-transparent'>
                <div className='relative mx-12 bg-base-300 dark:bg-gray-800'>
                    <button
                        type='button'
                        title='close'
                        className='absolute -right-12 text-neutral-content'
                        onClick={() => onClose(false)}
                    >
                        <XMarkIcon className='h-12 w-12' aria-hidden='true' />
                    </button>
                    <div className='max-w-4xl'>
                        <img src={images[currentIndex].url} alt={`Image ${currentIndex}`} />
                    </div>
                    <div className='flex justify-center gap-4 py-2'>
                        <button
                            className={`btn-info btn-outline btn ${
                                currentIndex === 0 && 'invisible'
                            }`}
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
        </div>
    );
};

export default ImageSliderModal;
