import {HouseLine} from '@phosphor-icons/react/dist/icons/HouseLine';
import {Heart} from '@phosphor-icons/react/dist/icons/Heart';
import {Tag} from '@phosphor-icons/react/dist/icons/Tag';
import {User} from '@phosphor-icons/react/dist/icons/User';
import {MagnifyingGlass} from '@phosphor-icons/react/dist/icons/MagnifyingGlass';
import {Icon} from '@phosphor-icons/react/dist/lib/types';
import {NavLink} from '@remix-run/react';
import Logo from '@/components/Logo';
import {Badge} from '@/components/ui/badge';
import useMediaQuery from '@/hooks/use-media-query';

type NavbarProps = {
  totalInCollection?: number;
  totalInWantlist?: number;
};

type NavbarMenuItem = {
  label: string;
  icon: Icon;
  to: string;
  total?: number;
};

const NavbarItem = (menuItem: NavbarMenuItem) => {
  const isMobile = useMediaQuery();

  return (
    <NavLink
      to={menuItem.to}
      prefetch="intent"
      className="relative flex flex-col md:flex-row justify-center md:justify-start items-center text-sm md:text-base gap-1 md:gap-4 md:px-8 md:py-4 md:border-l-4 border-transparent hover:cursor-pointer hover:bg-slate-100 hover:dark:bg-slate-800 100 h-full md:h-auto w-full font-bold transition-colors duration-200 ease-in-out"
    >
      {isMobile && menuItem.total ? (
        <>
          <menuItem.icon weight="bold" className="h-6 w-6" />
          <Badge variant="default" className="absolute top-2 right-1">
            {menuItem.total}
          </Badge>
        </>
      ) : (
        <menuItem.icon weight="bold" className="h-6 w-6" />
      )}
      <span className="hidden md:block">{menuItem.label}</span>
      {!isMobile && menuItem.total && <span className="ml-auto">{menuItem.total}</span>}
    </NavLink>
  );
};

const Navbar = ({totalInCollection, totalInWantlist}: NavbarProps) => {
  const menuItems: NavbarMenuItem[] = [
    {
      label: 'Home',
      icon: HouseLine,
      to: '/dashboard',
    },
    {
      label: 'Search',
      icon: MagnifyingGlass,
      to: '/search',
    },
    {
      label: 'Collection',
      icon: Tag,
      to: '/collection',
      total: totalInCollection,
    },
    {
      label: 'Wantlist',
      icon: Heart,
      to: '/wantlist',
      total: totalInWantlist,
    },
  ];

  return (
    <section
      id="navbar"
      className="layout-navbar flex md:flex-col md:pt-8 justify-between md:justify-start items-center md:items-start md:gap-4 shadow-inner md:shadow-none  md:border-r border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900"
    >
      <Logo className="hidden md:flex mx-8 my-6" />
      {menuItems.map((item) => (
        <NavbarItem key={item.label} {...item} />
      ))}
    </section>
  );
};

export default Navbar;
