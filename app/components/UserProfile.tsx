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

type UserProfileProps = {
  className: string;
  profile: GetProfileResponse;
};

const UserProfile = ({className, profile}: UserProfileProps) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img src={profile.avatar_url} className="w-10 h-10 rounded-full" />
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
    </div>
  );
};

export default UserProfile;
