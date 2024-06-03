import {HouseLine} from '@phosphor-icons/react/dist/icons/HouseLine';
import {Star} from '@phosphor-icons/react/dist/icons/Star';
import {Tag} from '@phosphor-icons/react/dist/icons/Tag';
import {User} from '@phosphor-icons/react/dist/icons/User';
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
      className="flex flex-col md:flex-row justify-center md:justify-start items-center gap-1 md:gap-4 md:px-8 md:py-4 md:border-l-4 border-transparent hover:cursor-pointer hover:bg-gray-800 hover:md:border-l-gray-100 h-full md:h-auto w-full font-bold text-gray-400"
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
      icon: <HouseLine weight="bold" size={24} />,
      to: '/dashboard',
    },
    {
      label: 'Collection',
      icon: <Tag weight="bold" size={24} />,
      to: '/collection',
    },
    {
      label: 'Wantlist',
      icon: <Star weight="bold" size={24} />,
      to: '/wantlist',
    },
    {
      label: 'Profile',
      icon: <User weight="bold" size={24} />,
      to: '/profile',
    },
  ];

  return (
    <section
      id="navbar"
      className="layout-navbar flex md:flex-col md:pt-8 justify-between md:justify-start items-center md:items-start md:gap-4 shadow-inner md:shadow-none md:border-r md:border-gray-300 bg-gray-950"
    >
      <Logo color="light" className="hidden md:flex mx-8 my-6" />
      {menuItems.map((item) => (
        <NavbarItem key={item.label} {...item} />
      ))}
    </section>
  );
};

export default Navbar;
