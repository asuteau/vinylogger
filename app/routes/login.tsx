import {ActionFunctionArgs} from '@remix-run/node';
import {authenticator} from '@/services/auth.server';

// Renders the UI
const LoginRoute = () => <h1>Login page</h1>;

// Updates persistent data
export const action = async ({request}: ActionFunctionArgs) => {
  return await authenticator.authenticate('discogs', request, {
    successRedirect: '/',
  });
};

export default LoginRoute;
