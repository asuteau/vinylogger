import {Button} from '@/components/ui/button';
import {useTheme} from '@/contexts/theme-context';
import {Moon} from '@phosphor-icons/react/dist/icons/Moon';
import {Sun} from '@phosphor-icons/react/dist/icons/Sun';

const ThemeToggle = () => {
  const [theme, setTheme] = useTheme();

  const toggleTheme = () => {
    setTheme((previousTheme) => (previousTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {theme === 'light' ? <Sun className="h-6 w-6 stroke-2" /> : <Moon className="h-6 w-6 stroke-2" />}
    </Button>
  );
};

export default ThemeToggle;
