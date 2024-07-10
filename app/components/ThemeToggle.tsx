import {useTheme} from '~/contexts/theme-context';
import {Button} from './ui/button';
import {Moon} from '@phosphor-icons/react/dist/icons/Moon';
import {Sun} from '@phosphor-icons/react/dist/icons/Sun';

const ThemeToggle = () => {
  const [theme, setTheme] = useTheme();

  const toggleTheme = () => {
    setTheme((previousTheme) => (previousTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );
};

export default ThemeToggle;
