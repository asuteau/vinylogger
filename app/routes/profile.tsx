import UserSignOut from '~/components/UserSignOut';
import {Button} from '~/components/ui/button';

// Provides data to the component
export const loader = async () => {
  return null;
};

// Renders the UI
const ProfileRoute = () => (
  <div className="flex w-full justify-center items-center">
    <Button asChild>
      <UserSignOut />
    </Button>
  </div>
);

// Updates persistent data
export const action = async () => {};

export default ProfileRoute;
