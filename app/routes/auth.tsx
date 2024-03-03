import {DiscogsOAuth} from '@lionralfs/discogs-client';
import {LoaderFunctionArgs, redirect} from '@remix-run/node';
import {commitSession, getSession} from '~/sessions.server';

// Provides data to the component
export const loader = async ({request}: LoaderFunctionArgs) => {
  // Get session storage
  let session = await getSession(request.headers.get('cookie'));
  const requestToken = session.get('requestToken') as string;
  const requestTokenSecret = session.get('requestTokenSecret') as string;

  // Fetch verifier from query params
  const url = new URL(request.url);
  const userVerifier = url.searchParams.get('oauth_verifier') as string;

  console.log('requestToken', requestToken);
  console.log('requestTokenSecret', requestTokenSecret);
  console.log('userVerifier', userVerifier);

  // Retrieve access token
  const oAuth = new DiscogsOAuth(process.env.DISCOGS_API_CONSUMER_KEY, process.env.DISCOGS_API_CONSUMER_SECRET);
  const {accessToken, accessTokenSecret} = await oAuth.getAccessToken(requestToken, requestTokenSecret, userVerifier);
  if (accessToken === null || accessTokenSecret === null) throw new Error('Getting access token failed!');
  console.log('>>> Get access token', accessToken, accessTokenSecret);

  session.set('accessToken', accessToken);
  session.set('accessTokenSecret', accessTokenSecret);

  return redirect('/', {
    headers: {
      // Commit the session storage
      'Set-Cookie': await commitSession(session),
    },
  });
};

// Renders the UI
const Auth = () => <h1>Auth page</h1>;

// Updates persistent data
export const action = async () => {};

export default Auth;
