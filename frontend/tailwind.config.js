/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            spacing: {
                '26': '6.5rem',
            },
            fontFamily: {
                'open-sans': 'Open Sans',
                'open-sans-condensed': 'Open Sans Condensed',
                'roboto': 'Roboto',
                'roboto-slab': 'Roboto Slab',
                'montserrat': 'Montserrat',
                'rubik': 'Rubik',
            },
        },
    },
    plugins: [
        require('@headlessui/tailwindcss'),
        require('daisyui'),
        require('@tailwindcss/aspect-ratio'),
    ],
    daisyui: {
        themes: [
            "light",
            "dark",
            "cupcake",
            "bumblebee",
            "emerald",
            "corporate",
            "synthwave",
            "retro",
            "cyberpunk",
            "valentine",
            "halloween",
            "garden",
            "forest",
            "aqua",
            "lofi",
            "pastel",
            "fantasy",
            "wireframe",
            "black",
            "luxury",
            "dracula",
            "cmyk",
            "autumn",
            "business",
            "acid",
            "lemonade",
            "night",
            "coffee",
            "winter",
          ],
    },
    darkMode: 'class',
}
