import {ActionFunctionArgs, LoaderFunctionArgs} from '@remix-run/node';
import {authenticator} from '@/services/auth.server';

const LoginRoute = () => <h1>Login page</h1>;

export const loader = async ({request}: LoaderFunctionArgs) => {
  return await authenticator.authenticate('discogs', request, {
    successRedirect: '/',
  });
};

export const action = async ({request}: ActionFunctionArgs) => {
  return await authenticator.authenticate('discogs', request, {
    successRedirect: '/',
  });
};

export default LoginRoute;
