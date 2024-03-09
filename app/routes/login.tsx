import {DiscogsOAuth} from '@lionralfs/discogs-client';
import {LoaderFunctionArgs, redirect} from '@remix-run/node';
import {commitSession, getSession} from '~/sessions.server';

// Provides data to the component
export const loader = async ({request}: LoaderFunctionArgs) => {
  // Initiating the Request Token
  const isProduction = process.env.NODE_ENV === 'production';
  const redirectUrl = isProduction ? `${process.env.APP_PRODUCTION_URL}/auth` : 'http://localhost:3000/auth';

  const oAuth = new DiscogsOAuth(process.env.DISCOGS_API_CONSUMER_KEY, process.env.DISCOGS_API_CONSUMER_SECRET);
  const {authorizeUrl, token: requestToken, tokenSecret: requestTokenSecret} = await oAuth.getRequestToken(redirectUrl);
  if (requestToken === null || requestTokenSecret === null) throw new Error('Getting request token failed!');
  console.log('>>> Get request token', authorizeUrl, requestToken, requestTokenSecret);

  // Get storage session
  let session = await getSession(request.headers.get('cookie'));
  console.log('SESSION', session.data);
  session.set('requestToken', requestToken);
  session.set('requestTokenSecret', requestTokenSecret);

  return redirect(authorizeUrl, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
};

// Renders the UI
const Login = () => <h1>Login page</h1>;

// Updates persistent data
export const action = async () => {};

export default Login;
