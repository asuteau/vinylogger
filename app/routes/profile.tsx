import {json, LoaderFunctionArgs} from '@remix-run/node';
import {useLoaderData} from '@remix-run/react';
import UserSignOut from '@/components/UserSignOut';
import {Button} from '@/components/ui/button';
import {authenticator} from '@/services/auth.server';

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
    <section id="profile" className="p-8 flex flex-col md:hidden gap-4 text-xs h-full">
      <div className="flex flex-col">
        <span className="text-slate-950 dark:text-slate-50 font-bold">Id</span>
        <span className="text-slate-600 dark:text-slate-400">{user.id}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-slate-950 dark:text-slate-50 font-bold">Username</span>
        <span className="text-slate-600 dark:text-slate-400">{user.username}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-slate-950 dark:text-slate-50 font-bold">Consumer name</span>
        <span className="text-slate-600 dark:text-slate-400">{user.consumerName}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-slate-950 dark:text-slate-50 font-bold">Resource URL</span>
        <span className="text-slate-600 dark:text-slate-400">{user.resourceUrl}</span>
      </div>

      <div className="mt-auto self-center">
        <Button asChild>
          <UserSignOut />
        </Button>
      </div>
    </section>
  );
};

export default ProfileRoute;
