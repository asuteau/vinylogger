import {useState, useEffect} from 'react';

const useDebounce = (inputValue: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState<string>(inputValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, delay]);

  return debouncedValue;
};

export default useDebounce;
