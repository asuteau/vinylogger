import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const extractColors = (text: string): string[] => {
  const colorNames = [
    'red',
    'blue',
    'green',
    'yellow',
    'black',
    'white',
    'purple',
    'orange',
    'pink',
    'brown',
    'gray',
    'silver',
    'gold',
  ];
  const colorRegex = new RegExp(colorNames.join('|'), 'gi');
  return text.match(colorRegex) || [];
};
