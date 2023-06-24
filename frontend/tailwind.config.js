/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // primary: 'var(--primary)',
                // onNeutralBg: 'var(--onNeutralBg)',
                // neutralBg: 'var(--neutralBg)',
                // onPrimaryBg: 'var(--onPrimaryBg)',
                // primaryBg: 'var(--primaryBg)',
            },
            spacing: {
                '26': '6.5rem',
            },
            fontFamily: {
                'chilanka': 'Chilanka',
                'open-sans': 'Open Sans',
                'open-sans-condensed': 'Open Sans Condensed',
                'roboto': 'Roboto',
                'roboto-slab': 'Roboto Slab',
                'montserrat': 'Montserrat', // fav 
                'raleway': 'Raleway',
                'rubik': 'Rubik',
            },
        },
    },
    plugins: [
        // eslint-disable-next-line no-undef
        require('@headlessui/tailwindcss'),
        // eslint-disable-next-line no-undef
        require('daisyui'),
    ],
    daisyui: {
        themes: ["light", "dark", "cupcake"],
    },
}
