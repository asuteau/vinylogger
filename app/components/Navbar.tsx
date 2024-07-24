import {HouseLine} from '@phosphor-icons/react/dist/icons/HouseLine';
import {Star} from '@phosphor-icons/react/dist/icons/Star';
import {Tag} from '@phosphor-icons/react/dist/icons/Tag';
import {User} from '@phosphor-icons/react/dist/icons/User';
import {MagnifyingGlass} from '@phosphor-icons/react/dist/icons/MagnifyingGlass';
import {NavLink} from '@remix-run/react';
import {ReactNode} from 'react';
import Logo from '@/components/Logo';
import {Badge} from '@/components/ui/badge';
import useMediaQuery from '@/hooks/use-media-query';

type NavbarProps = {
  totalInCollection?: number;
  totalInWantlist?: number;
};

type NavbarMenuItem = {
  label: string;
  icon: ReactNode;
  to: string;
  total?: number;
};

const NavbarItem = ({label, icon, to, total}: NavbarMenuItem) => {
  const isMobile = useMediaQuery();

  return (
    <NavLink
      to={to}
      prefetch="intent"
      className="flex flex-col md:flex-row justify-center md:justify-start items-center text-sm md:text-base gap-1 md:gap-4 md:px-8 md:py-4 md:border-l-4 border-transparent hover:cursor-pointer hover:bg-slate-800 hover:md:border-l-slate-100 h-full md:h-auto w-full font-bold text-slate-400"
    >
      {isMobile && total ? (
        <Badge variant="secondary" className="h-5">
          {total}
        </Badge>
      ) : (
        icon
      )}
      <span>{label}</span>
      {!isMobile && total && <span className="ml-auto">{total}</span>}
    </NavLink>
  );
};

const Navbar = ({totalInCollection, totalInWantlist}: NavbarProps) => {
  const menuItems: NavbarMenuItem[] = [
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
      total: totalInCollection,
    },
    {
      label: 'Wantlist',
      icon: <Star weight="bold" className="h-5 md:h-6 w-5 md:w-6" />,
      to: '/wantlist',
      total: totalInWantlist,
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
      className="layout-navbar flex md:flex-col md:pt-8 justify-between md:justify-start items-center md:items-start md:gap-4 shadow-inner md:shadow-none border-t md:border-t-0 md:border-r border-slate-300 dark:border-slate-600 bg-slate-950"
    >
      <Logo className="hidden md:flex mx-8 my-6" />
      {menuItems.map((item) => (
        <NavbarItem key={item.label} {...item} />
      ))}
    </section>
  );
};

export default Navbar;
