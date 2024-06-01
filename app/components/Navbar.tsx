import {HouseLine} from '@phosphor-icons/react/dist/icons/HouseLine';
import {Star} from '@phosphor-icons/react/dist/icons/Star';
import {Tag} from '@phosphor-icons/react/dist/icons/Tag';
import {User} from '@phosphor-icons/react/dist/icons/User';
import {NavLink} from '@remix-run/react';
import {ReactNode} from 'react';

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
      className="flex flex-col md:flex-row justify-center items-center gap-1 md:gap-2 md:p-2 hover:cursor-pointer hover:bg-gray-200 hover:rounded-lg"
    >
      {icon}
      <span className="text-sm">{label}</span>
    </NavLink>
  );
};

const Navbar = () => {
  const menuItems: MenuItem[] = [
    {
      label: 'Home',
      icon: <HouseLine size={24} className="text-gray-600" />,
      to: '/',
    },
    {
      label: 'Collection',
      icon: <Tag size={24} className="text-gray-600" />,
      to: '/collection',
    },
    {
      label: 'Wantlist',
      icon: <Star size={24} className="text-gray-600" />,
      to: '/wantlist',
    },
    {
      label: 'Profile',
      icon: <User size={24} className="text-gray-600" />,
      to: '/profile',
    },
  ];

  return (
    <section className="layout-navbar flex md:flex-col px-8 md:p-8 justify-between md:justify-start items-center md:items-start md:gap-4 shadow-inner md:shadow-none md:border-r md:border-gray-300 bg-gray-100">
      {menuItems.map((item) => (
        <NavbarItem key={item.label} {...item} />
      ))}
    </section>
  );
};

export default Navbar;
