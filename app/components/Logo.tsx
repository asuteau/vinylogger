import {NavLink} from '@remix-run/react';

type LogoProps = {
  className?: string;
};

const Logo = ({className}: LogoProps) => {
  return (
    <NavLink id="logo" to="/" className={`flex gap-4 md:gap-6 items-center font-logo ${className} logo`}>
      <img className="h-10 aspect-square rounded-full md:rounded-xl" src="/logo.svg" alt="logo" />
      <h1 className="hidden md:block font-['BricolageGrotesque'] text-slate-900 dark:text-slate-50">Vinylogger</h1>
    </NavLink>
  );
};

export default Logo;
