import UserProfile from './UserProfile';
import {GetProfileResponse} from '@lionralfs/discogs-client';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import useMediaQuery from '~/hooks/use-media-query';

type HeaderProps = {
  profile: GetProfileResponse | null;
};

const Header = ({profile}: HeaderProps) => {
  const isMobile = useMediaQuery();

  return (
    <section className="layout-header p-8 flex justify-start md:justify-start items-center gap-2 shadow-md md:shadow-none border-b  border-slate-300 dark:border-slate-600">
      {isMobile && <Logo />}
      <div className="flex gap-2 ml-auto">
        <ThemeToggle />
        {profile && <UserProfile profile={profile} />}
      </div>
    </section>
  );
};

export default Header;
