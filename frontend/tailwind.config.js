const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    darkMode: 'class',
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            screens: {
                xs: '512px',
            },
            fontFamily: {
                serif: ['Space Grotesk', ...defaultTheme.fontFamily.serif],
            },
            colors: {
                'background-dark': '#202428',
                'zapper-dark-gray': '#151A1E',
                'gray-350': '#B7BCC5',
                'gray-750': '#2B3544',
                'gray-850': '#18212F',
            },
            backgroundImage: {
                darkImage: `url('/images/blue_gold_background.webp')`,
                candyland: `url('/images/candyland.png')`,
            },
            boxShadow: {
                '3xl-dark': '0 32px 32px 16px rgb(0 0 0 / 0.2)',
                '3xl-light': '0 32px 32px 16px rgb(0 0 0 / 0.1)',
            },
            animation: {
                'blob-1': 'blob-1 8s ease-in-out infinite',
                'blob-2': 'blob-2 8s ease-in-out infinite',
                'blob-3': 'blob-3 8s ease-in-out infinite',
            },
            keyframes: {
                'blob-1': {
                    '0%, 100%': { transform: 'translate(-90%, -60%) scale(0.9)' },
                    '25%, 75%': { transform: 'translate(-95%, -65%) scale(1.1)' },
                    '50%': { transform: 'translate(-100%, -70%) scale(1)' },
                },
                'blob-2': {
                    '0%, 100%': { transform: 'translate(-10%, -60%) scale(1)' },
                    '25%, 75%': { transform: 'translate(-5%, -65%) scale(1.1)' },
                    '50%': { transform: 'translate(+0%, -70%) scale(0.9)' },
                },
                'blob-3': {
                    '0%, 100%': { transform: 'translate(-50%, -40%) scale(1.1)' },
                    '25%, 75%': { transform: 'translate(-45%, -15%) scale(1)' },
                    '50%': { transform: 'translate(-40%, -10%) scale(0.9)' },
                },
            },
        },
    },
    plugins: [require('@tailwindcss/aspect-ratio'), require('@tailwindcss/forms')],
}
