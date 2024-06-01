import {LoaderFunctionArgs} from '@remix-run/node';
import {logout} from '~/utils/session.server';

// Provides data to the component
export const loader = async ({request}: LoaderFunctionArgs) => {
  return logout(request);
};

// Renders the UI
const LogoutRoute = () => <h1>Logout page</h1>;

// Updates persistent data
export const action = async () => {};

export default LogoutRoute;
