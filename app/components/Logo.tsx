import {NavLink} from '@remix-run/react';
import {useTheme} from '@/contexts/theme-context';
import useMediaQuery from '@/hooks/use-media-query';

type LogoProps = {
  className?: string;
};

const Logo = ({className}: LogoProps) => {
  const isMobile = useMediaQuery();
  const [theme] = useTheme();
  const isLight = theme === 'light';

  return (
    <NavLink id="logo" to="/" className={`flex gap-4 md:gap-6 items-center font-logo ${className} logo`}>
      <img className="h-10 md:h-16 aspect-square rounded-full md:rounded-xl" src="/img/logo.png" alt="logo" />
      <h1 className="font-['BricolageGrotesque'] text-slate-900 dark:text-slate-50">Vinylogger</h1>
    </NavLink>
  );
};

export default Logo;
