import {LoaderFunctionArgs} from '@remix-run/node';
import {authenticate, getRequestToken, getUserSession, hasAlreadyRequestedToken} from '~/utils/session.server';

// Provides data to the component
export const loader = async ({request}: LoaderFunctionArgs) => {
  if (!(await hasAlreadyRequestedToken(request))) return getRequestToken(request);

  const url = new URL(request.url);
  const userVerifier = url.searchParams.get('oauth_verifier') as string;
  return authenticate(request, userVerifier);
};

// Renders the UI
const AuthRoute = () => <h1>Auth page</h1>;

// Updates persistent data
export const action = async () => {};

export default AuthRoute;
