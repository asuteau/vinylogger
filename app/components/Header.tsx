import useMediaQuery from '@/hooks/use-media-query';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import UserProfile from '@/components/UserProfile';

type HeaderProps = {
  avatar: string;
  username: string;
};

const Header = (props: HeaderProps) => {
  const isMobile = useMediaQuery();

  return (
    <section className="layout-header p-8 flex justify-start md:justify-start items-center gap-2 border-b border-slate-300 dark:border-slate-600">
      {isMobile && <Logo />}
      <div className="flex gap-2 ml-auto">
        <ThemeToggle />
        <UserProfile {...props} />
      </div>
    </section>
  );
};

export default Header;
