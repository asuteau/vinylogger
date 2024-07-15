import {LoaderFunctionArgs} from '@remix-run/node';
import {authenticator} from '~/services/auth.server';

// Provides data to the component
export const loader = async ({request}: LoaderFunctionArgs) => {
  await authenticator.authenticate('discogs', request, {
    successRedirect: '/',
    failureRedirect: '/login',
  });
};

// Renders the UI
const LoginCallbackRoute = () => <h1>Login callback Page</h1>;

export default LoginCallbackRoute;
