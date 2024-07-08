import {GetProfileResponse} from '@lionralfs/discogs-client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {Button} from './ui/button';
import UserSignOut from './UserSignOut';
import useMediaQuery from '~/hooks/use-media-query';

type UserProfileProps = {
  className?: string;
  profile: GetProfileResponse;
};

const UserProfile = ({className, profile}: UserProfileProps) => {
  const isMobile = useMediaQuery();

  return (
    <div className={`flex items-center ${className}`}>
      <img src={profile.avatar_url} className="w-8 md:w-10 aspect-square rounded-full" />
      {!isMobile && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="link" className="text-lg">
              {profile.username}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserSignOut />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default UserProfile;
