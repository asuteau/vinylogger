import {ActionFunctionArgs, redirect} from '@vercel/remix';
import {authenticator} from '~/services/auth.server';
import {addReleaseToWantlist} from '~/services/discogs.api.user';

export const action = async ({params, request}: ActionFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/',
  });

  const versionId = params.versionId;
  if (!versionId) return redirect('/');

  await addReleaseToWantlist(user, versionId);
  return redirect('/');
};
