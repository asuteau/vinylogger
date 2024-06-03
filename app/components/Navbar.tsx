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
      className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4 md:p-2 hover:cursor-pointer hover:bg-gray-700 hover:rounded-lg"
    >
      {icon}
      <span className=" text-gray-100">{label}</span>
    </NavLink>
  );
};

const Navbar = () => {
  const menuItems: MenuItem[] = [
    {
      label: 'Home',
      icon: <HouseLine weight="bold" size={24} className="text-gray-200" />,
      to: '/',
    },
    {
      label: 'Collection',
      icon: <Tag weight="bold" size={24} className="text-gray-200" />,
      to: '/collection',
    },
    {
      label: 'Wantlist',
      icon: <Star weight="bold" size={24} className="text-gray-200" />,
      to: '/wantlist',
    },
    {
      label: 'Profile',
      icon: <User weight="bold" size={24} className="text-gray-200" />,
      to: '/profile',
    },
  ];

  return (
    <section
      id="navbar"
      className="layout-navbar flex md:flex-col px-8 md:p-8 justify-between md:justify-start items-center md:items-start md:gap-4 shadow-inner md:shadow-none md:border-r md:border-gray-300 bg-gray-950"
    >
      <Logo color="light" className="hidden md:flex my-8" />
      {menuItems.map((item) => (
        <NavbarItem key={item.label} {...item} />
      ))}
    </section>
  );
};

export default Navbar;
