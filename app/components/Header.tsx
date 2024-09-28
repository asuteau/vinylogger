import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import UserProfile from '@/components/UserProfile';
import useMediaQuery from '@/hooks/use-media-query';

type HeaderProps = {
  avatar: string;
  username: string;
};

const Header = (props: HeaderProps) => {
  const isMobile = useMediaQuery();

  return (
    <header className="layout-header px-8 flex justify-start md:justify-start items-center gap-2 border-b border-border">
      {isMobile && <Logo />}
      <div className="flex gap-2 ml-auto">
        <ThemeToggle />
        <UserProfile {...props} />
      </div>
    </header>
  );
};

export default Header;
