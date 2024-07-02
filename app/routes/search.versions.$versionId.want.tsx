import {ActionFunctionArgs, redirect} from '@vercel/remix';
import {getClient, getUser} from '~/utils/session.server';

export const action = async ({params, request}: ActionFunctionArgs) => {
  const user = await getUser(request);
  const versionId = params.versionId;
  if (!versionId || !user) return redirect('/');

  const client = await getClient(request);
  await client.user().wantlist().addRelease(user.username, versionId, {});
  return redirect('/');
};
