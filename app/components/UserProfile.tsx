import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UserSignOut from '@/components/UserSignOut';
import useMediaQuery from '@/hooks/use-media-query';
import {NavLink} from '@remix-run/react';

type UserProfileProps = {
  className?: string;
  avatar: string;
  username: string;
};

const UserProfile = ({className, avatar, username}: UserProfileProps) => {
  const isMobile = useMediaQuery();

  return (
    <div className={`flex items-center ${className}`}>
      <Avatar asChild>
        <NavLink to="/profile">
          <AvatarImage src={avatar} alt="avatar" />
          <AvatarFallback>CN</AvatarFallback>
        </NavLink>
      </Avatar>
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
