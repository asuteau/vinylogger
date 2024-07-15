import {ActionFunctionArgs, redirect} from '@vercel/remix';
import {authenticator} from '~/services/auth.server';
import {addReleaseToCollection} from '~/services/discogs.api';

export const action = async ({params, request}: ActionFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/',
  });

  const versionId = params.versionId;
  if (!versionId) return redirect('/');

  await addReleaseToCollection(user, versionId);
  return redirect('/');
};
