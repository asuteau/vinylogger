import {VinylRecord} from '@phosphor-icons/react/dist/icons/VinylRecord';
import {NavLink} from '@remix-run/react';
import {useTheme} from '~/contexts/theme-context';
import useMediaQuery from '~/hooks/use-media-query';
type LogoProps = {
  className?: string;
};

const Logo = ({className}: LogoProps) => {
  const isMobile = useMediaQuery();
  const [theme] = useTheme();

  return (
    <NavLink id="logo" to="/dashboard" className={`flex gap-2 md:gap-4 items-center font-logo ${className} logo`}>
      <VinylRecord
        size={isMobile ? 32 : 48}
        weight="duotone"
        className={theme === 'light' ? 'fill-slate-900' : 'fill-slate-100'}
      />
      <h1 className={theme === 'light' ? 'text-slate-900' : 'text-slate-100'}>Vinylogger</h1>
    </NavLink>
  );
};

export default Logo;
