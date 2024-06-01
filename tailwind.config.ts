import type {Config} from 'tailwindcss';
import {fontFamily} from 'tailwindcss/defaultTheme';

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DMSans', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;
