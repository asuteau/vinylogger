import {HouseLine, Star, Tag, User} from '@phosphor-icons/react';
import {ReactNode} from 'react';

type MenuItem = {
  label: string;
  icon: ReactNode;
};

const NavbarItem = ({label, icon}: MenuItem) => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-1 md:gap-2">
      {icon}
      <div>{label}</div>
    </div>
  );
};

const Navbar = () => {
  const menuItems: MenuItem[] = [
    {
      label: 'Home',
      icon: <HouseLine size={24} />,
    },
    {
      label: 'Collection',
      icon: <Tag size={24} />,
    },
    {
      label: 'Wantlist',
      icon: <Star size={24} />,
    },
    {
      label: 'Profile',
      icon: <User size={24} />,
    },
  ];

  return (
    <section className="layout-navbar flex md:flex-col px-8 md:p-8 justify-between md:justify-start items-center md:items-start md:gap-4 shadow-inner md:shadow-none md:border-r md:border-gray-300">
      {menuItems.map((item) => (
        <NavbarItem key={item.label} {...item} />
      ))}
    </section>
  );
};

export default Navbar;
