import {DiscogsClient, DiscogsOAuth} from '@lionralfs/discogs-client';
import {GetIdentityResponse} from '@lionralfs/discogs-client/types/types';
import {Session, createCookieSessionStorage, redirect} from '@remix-run/node';

type SessionData = {
  requestToken: string;
  requestTokenSecret: string;
  accessToken: string;
  accessTokenSecret: string;
  user: GetIdentityResponse;
};

type SessionFlashData = {
  error: string;
};

const storage = createCookieSessionStorage<SessionData, SessionFlashData>({
  cookie: {
    name: '__remix_session',
    path: '/',
    sameSite: 'lax',
    secrets: ['s3cret1'],
    maxAge: 365 * 24 * 60 * 60, // 1 year
  },
});

export const getUserSession = (request: Request): Promise<Session<SessionData, SessionFlashData>> => {
  return storage.getSession(request.headers.get('cookie'));
};

export const getRequestToken = async (request: Request) => {
  const session = await getUserSession(request);

  const isProduction = process.env.NODE_ENV === 'production';
  const redirectUrl = isProduction ? `${process.env.APP_PRODUCTION_URL}/auth` : 'http://localhost:3000/auth';
  const consumerKey = process.env.DISCOGS_API_CONSUMER_KEY as string;
  const consumerSecret = process.env.DISCOGS_API_CONSUMER_SECRET as string;

  const oAuth = new DiscogsOAuth(consumerKey, consumerSecret);
  const {authorizeUrl, token: requestToken, tokenSecret: requestTokenSecret} = await oAuth.getRequestToken(redirectUrl);
  if (requestToken === null || requestTokenSecret === null) throw new Error('Getting request token failed!');

  session.set('requestToken', requestToken);
  session.set('requestTokenSecret', requestTokenSecret);

  return redirect(authorizeUrl, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  });
};

export const authenticate = async (request: Request, userVerifier: string) => {
  const session = await getUserSession(request);

  const requestToken = session.get('requestToken') as string;
  const requestTokenSecret = session.get('requestTokenSecret') as string;
  const consumerKey = process.env.DISCOGS_API_CONSUMER_KEY as string;
  const consumerSecret = process.env.DISCOGS_API_CONSUMER_SECRET as string;

  const oAuth = new DiscogsOAuth(consumerKey, consumerSecret);
  const {accessToken, accessTokenSecret} = await oAuth.getAccessToken(requestToken, requestTokenSecret, userVerifier);
  if (accessToken === null || accessTokenSecret === null) throw new Error('Getting access token failed!');

  session.set('accessToken', accessToken);
  session.set('accessTokenSecret', accessTokenSecret);

  // Fetch user identity and add it to the session
  const client = new DiscogsClient({
    auth: {
      method: 'oauth',
      consumerKey: process.env.DISCOGS_API_CONSUMER_KEY,
      consumerSecret: process.env.DISCOGS_API_CONSUMER_SECRET,
      accessToken: session.get('accessToken'),
      accessTokenSecret: session.get('accessTokenSecret'),
    },
  });
  // TODO: Cannot use getClient because the sessioln has not been committed yet
  // const client = await getClient(request);
  const identity = await client.getIdentity();
  session.set('user', identity.data);

  return redirect('/', {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  });
};

export const isAuthenticated = async (request: Request): Promise<boolean> => {
  const session = await getUserSession(request);
  const accessToken = session.get('accessToken');
  const accessTokenSecret = session.get('accessTokenSecret');
  return !!accessToken && !!accessTokenSecret;
};

export const hasAlreadyRequestedToken = async (request: Request): Promise<boolean> => {
  const session = await getUserSession(request);
  const requestToken = session.get('requestToken');
  const requestTokenSecret = session.get('requestTokenSecret');
  return requestToken !== undefined && requestTokenSecret !== undefined;
};

export const getUser = async (request: Request) => {
  const session = await getUserSession(request);
  const user = session.get('user');
  if (!user) {
    return null;
  }
  return user;
};

export const getClient = async (request: Request) => {
  const session = await getUserSession(request);
  return new DiscogsClient({
    auth: {
      method: 'oauth',
      consumerKey: process.env.DISCOGS_API_CONSUMER_KEY,
      consumerSecret: process.env.DISCOGS_API_CONSUMER_SECRET,
      accessToken: session.get('accessToken'),
      accessTokenSecret: session.get('accessTokenSecret'),
    },
  });
};

export const logout = async (request: Request) => {
  const session = await getUserSession(request);
  return redirect('/', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  });
};
