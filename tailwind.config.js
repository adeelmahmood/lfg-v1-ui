/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            spacing: {
                "2/3": "66.6666667%",
            },
        },
    },
    plugins: [require("@tailwindcss/aspect-ratio"), require("@tailwindcss/forms")],
};
