/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fef7ee',
                    100: '#fdedd6',
                    200: '#fad7ac',
                    300: '#f6bb77',
                    400: '#f1943e',
                    500: '#ed7519',
                    600: '#de5a0f',
                    700: '#b8430f',
                    800: '#933514',
                    900: '#762e14',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
} 