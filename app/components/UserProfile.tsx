import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Button} from '@/components/ui/button';
import UserSignOut from '@/components/UserSignOut';
import useMediaQuery from '@/hooks/use-media-query';

type UserProfileProps = {
  className?: string;
  avatar: string;
  username: string;
};

const UserProfile = ({className, avatar, username}: UserProfileProps) => {
  const isMobile = useMediaQuery();

  return (
    <div className={`flex items-center ${className}`}>
      <img src={avatar} className="w-8 md:w-10 aspect-square rounded-full" />
      {!isMobile && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="link" className="text-lg">
              {username}
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
