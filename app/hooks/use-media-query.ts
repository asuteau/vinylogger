import {useState, useEffect} from 'react';

const DEFAULT_MEDIA_QUERY = '(max-width: 768px)';

const useMediaQuery = (): boolean => {
  const [matches, setMatches] = useState(false);

  const handleChange = (event: any) => {
    setMatches(event.matches);
  };

  useEffect(() => {
    const matchQueryList = window.matchMedia(DEFAULT_MEDIA_QUERY);
    matchQueryList.addEventListener('change', handleChange);

    return () => window.removeEventListener('change', handleChange);
  }, []);

  return matches;
};

export default useMediaQuery;
