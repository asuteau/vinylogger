import {json, LoaderFunctionArgs} from '@remix-run/node';
import {useLoaderData} from '@remix-run/react';
import UserSignOut from '~/components/UserSignOut';
import {Button} from '~/components/ui/button';
import {authenticator} from '~/services/auth.server';

// Provides data to the component
export const loader = async ({request}: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/',
  });

  return json({user});
};

// Renders the UI
const ProfileRoute = () => {
  const {user} = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col md:hidden gap-4 text-xs h-full">
      <div className="flex flex-col">
        <span className="text-slate-950 font-bold">Id</span>
        <span className="text-slate-600">{user.id}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-slate-950 font-bold">Username</span>
        <span className="text-slate-600">{user.username}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-slate-950 font-bold">Consumer name</span>
        <span className="text-slate-600">{user.consumerName}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-slate-950 font-bold">Resource URL</span>
        <span className="text-slate-600">{user.resourceUrl}</span>
      </div>

      <div className="mt-auto self-center">
        <Button asChild>
          <UserSignOut />
        </Button>
      </div>
    </div>
  );
};

export default ProfileRoute;
