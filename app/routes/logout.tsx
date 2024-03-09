import {LoaderFunctionArgs, redirect} from '@remix-run/node';
import {destroySession, getSession} from '~/sessions.server';

// Provides data to the component
export const loader = async ({request}: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get('cookie'));
  return redirect('/', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  });
};

// Renders the UI
const Logout = () => <h1>Logout page</h1>;

// Updates persistent data
export const action = async () => {};

export default Logout;
