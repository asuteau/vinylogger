import {VinylRecord} from '@phosphor-icons/react/dist/icons/VinylRecord';
import {NavLink} from '@remix-run/react';
import useMediaQuery from '~/hooks/use-media-query';
type LogoProps = {
  className: string;
  color?: 'light' | 'dark';
};

const Logo = ({className, color = 'dark'}: LogoProps) => {
  const isMobile = useMediaQuery();

  return (
    <NavLink id="logo" to="/dashboard" className={`flex gap-2 md:gap-4 items-center font-logo ${className} logo`}>
      <VinylRecord
        size={isMobile ? 32 : 48}
        weight="duotone"
        className={color === 'light' ? 'fill-slate-100' : 'fill-slate-900'}
      />
      <h1 className={color === 'light' ? 'text-slate-100' : 'text-slate-900'}>Vinylogger</h1>
    </NavLink>
  );
};

export default Logo;
