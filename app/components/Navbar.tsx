import {HouseLine} from '@phosphor-icons/react/dist/icons/HouseLine';
import {Star} from '@phosphor-icons/react/dist/icons/Star';
import {Tag} from '@phosphor-icons/react/dist/icons/Tag';
import {User} from '@phosphor-icons/react/dist/icons/User';
import {MagnifyingGlass} from '@phosphor-icons/react/dist/icons/MagnifyingGlass';
import {NavLink} from '@remix-run/react';
import {ReactNode} from 'react';
import Logo from './Logo';

type MenuItem = {
  label: string;
  icon: ReactNode;
  to: string;
};

const NavbarItem = ({label, icon, to}: MenuItem) => {
  return (
    <NavLink
      to={to}
      prefetch="intent"
      className="flex flex-col md:flex-row justify-center md:justify-start items-center text-sm md:text-base gap-1 md:gap-4 md:px-8 md:py-4 md:border-l-4 border-transparent hover:cursor-pointer hover:bg-slate-800 hover:md:border-l-slate-100 h-full md:h-auto w-full font-bold text-slate-400"
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

const Navbar = () => {
  const menuItems: MenuItem[] = [
    {
      label: 'Home',
      icon: <HouseLine weight="bold" className="h-5 md:h-6 w-5 md:w-6" />,
      to: '/dashboard',
    },
    {
      label: 'Search',
      icon: <MagnifyingGlass weight="bold" className="h-5 md:h-6 w-5 md:w-6" />,
      to: '/search',
    },
    {
      label: 'Collection',
      icon: <Tag weight="bold" className="h-5 md:h-6 w-5 md:w-6" />,
      to: '/collection',
    },
    {
      label: 'Wantlist',
      icon: <Star weight="bold" className="h-5 md:h-6 w-5 md:w-6" />,
      to: '/wantlist',
    },
    {
      label: 'Profile',
      icon: <User weight="bold" className="h-5 md:h-6 w-5 md:w-6" />,
      to: '/profile',
    },
  ];

  return (
    <section
      id="navbar"
      className="layout-navbar flex md:flex-col md:pt-8 justify-between md:justify-start items-center md:items-start md:gap-4 shadow-inner md:shadow-none md:border-r md:border-slate-300 bg-slate-950"
    >
      <Logo color="light" className="hidden md:flex mx-8 my-6" />
      {menuItems.map((item) => (
        <NavbarItem key={item.label} {...item} />
      ))}
    </section>
  );
};

export default Navbar;
