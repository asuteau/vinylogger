import UserProfile from './UserProfile';
import {GetProfileResponse} from '@lionralfs/discogs-client';
import Logo from './Logo';

type HeaderProps = {
  profile: GetProfileResponse | null;
};

const Header = ({profile}: HeaderProps) => {
  return (
    <section className="layout-header p-8 flex justify-center md:justify-start items-center gap-2 shadow-md md:shadow-none md:border-b md:border-slate-300">
      <Logo className="md:hidden" />
      {profile && <UserProfile className="hidden md:flex ml-auto" profile={profile} />}
    </section>
  );
};

export default Header;
