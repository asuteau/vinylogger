import {VinylRecord} from '@phosphor-icons/react/dist/icons/VinylRecord';
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
    <NavLink id="logo" to="/" className={`flex gap-2 items-center font-logo ${className} logo`}>
      <VinylRecord size={isMobile ? 32 : 48} weight="duotone" className="fill-sky-700" />
      <h1 className="font-['BricolageGrotesque'] text-slate-900 dark:text-slate-50">Vinylogger</h1>
    </NavLink>
  );
};

export default Logo;
