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

    // Check on mount (callback is not called until a change occurs)
    // See https://github.com/chakra-ui/chakra-ui/issues/3124
    if (matchQueryList.matches) {
      setMatches(true);
    }

    return () => window.removeEventListener('change', handleChange);
  }, []);

  return matches;
};

export default useMediaQuery;
