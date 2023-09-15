import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface Props {
    onChange: (value: any) => void;
}

const EmojiPicker = ({onChange}: Props) => {
    return (
        <div className='dropdown'>
            <label tabIndex={0} className='cursor-pointer rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white'>
                <svg
                    aria-hidden='true'
                    className='h-5 w-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z'
                        clipRule='evenodd'
                    ></path>
                </svg>
                <span className='sr-only'>Add emoji</span>
            </label>
            <ul
                tabIndex={0}
                className='dropdown-content menu rounded-box z-[1] p-2'
            >
                <Picker data={data} onEmojiSelect={onChange} />
            </ul>
        </div>
    );
};

export default EmojiPicker;
