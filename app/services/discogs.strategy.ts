import {AppLoadContext, json, redirect, Session, SessionData, SessionStorage} from '@remix-run/node';
import createDebug from 'debug';
import {AuthenticateOptions, Strategy, StrategyVerifyCallback} from 'remix-auth';
import * as crypto from 'crypto';
import {commitSession} from './session.server';

const debug = createDebug('discogs:strategy');

export const DiscogsStrategyDefaultName = 'discogs';
export const DiscogsUserAgent = 'Vinylogger/1.0';

const requestTokenURL = 'https://api.discogs.com/oauth/request_token';
const authorizationURL = 'https://www.discogs.com/oauth/authorize';
const tokenURL = 'https://api.discogs.com/oauth/access_token';
const identityURL = 'https://api.discogs.com/oauth/identity';
const profileURL = 'https://api.discogs.com/users/{username}';

export interface DiscogsStrategyOptions {
  consumerKey: string;
  consumerSecret: string;
  callbackURL: string;
}

export interface Profile {
  id: number;
  username: string;
  resourceUrl: string;
  consumerName: string;
  avatar: string;
  itemsInCollection: number;
  itemsInWantlist: number;
}

// TODO: Remove that duplicate type
export type User = {
  id: number;
  username: string;
  consumerName: string;
  resourceUrl: string;
  avatar: string;
  itemsInCollection: number;
  itemsInWantlist: number;
  accessToken: string;
  accessTokenSecret: string;
  consumerKey: string;
  consumerSecret: string;
};

export interface DiscogsStrategyVerifyParams {
  accessToken: string;
  accessTokenSecret: string;
  profile: Profile;
  context?: AppLoadContext;
}

export class DiscogsStrategy<User> extends Strategy<User, DiscogsStrategyVerifyParams> {
  name = DiscogsStrategyDefaultName;

  protected consumerKey: string;
  protected consumerSecret: string;
  protected callbackURL: string;

  constructor(options: DiscogsStrategyOptions, verify: StrategyVerifyCallback<User, DiscogsStrategyVerifyParams>) {
    super(verify);
    this.consumerKey = options.consumerKey;
    this.consumerSecret = options.consumerSecret;
    this.callbackURL = options.callbackURL;
  }

  async authenticate(request: Request, sessionStorage: SessionStorage, options: AuthenticateOptions): Promise<User> {
    debug('Request URL', request.url.toString());
    const url = new URL(request.url);
    const session = await sessionStorage.getSession(request.headers.get('Cookie'));

    let user: User | null = session.get(options.sessionKey) ?? null;

    session.flash('redirect', url.toString());

    debug('Cookie session', session.get('redirect'));

    // User is already authenticated
    if (user) {
      debug('User is authenticated');
      return this.success(user, request, sessionStorage, options);
    }

    const callbackURL = this.getCallbackURL(url);
    debug('Callback URL', callbackURL.toString());

    // Before user navigates to login page: Redirect to login page
    if (url.pathname !== callbackURL.pathname) {
      // Unlike OAuth2, we first hit the request token endpoint
      const {requestToken, callbackConfirmed} = await this.getRequestToken(callbackURL, session);

      if (!callbackConfirmed) {
        throw json(
          {message: 'Callback not confirmed'},
          {
            status: 401,
          },
        );
      }

      // Then const user authorize the app
      throw redirect(this.getAuthURL(requestToken).toString(), {
        headers: {
          'Set-Cookie': await sessionStorage.commitSession(session),
        },
      });
    }

    // Validations of the callback URL params
    const oauthToken = url.searchParams.get('oauth_token');
    if (!oauthToken) throw json({message: 'Missing oauth token from auth response.'}, {status: 400});
    const oauthVerifier = url.searchParams.get('oauth_verifier');
    if (!oauthVerifier) throw json({message: 'Missing oauth verifier from auth response.'}, {status: 400});

    // Validation of the requestTokenSecret from the session
    const requestTokenSecret = session.get('requestTokenSecret');
    if (!requestTokenSecret) {
      throw json({message: 'Missing request token secret from session.'}, {status: 400});
    }

    // Get the access token
    const {accessToken, accessTokenSecret} = await this.getAccessToken(oauthToken, oauthVerifier, requestTokenSecret);

    // Get the user identity
    const userIdentity = await this.checkUserIdentity(accessToken, accessTokenSecret);
    debug('Check user identity', userIdentity);

    // Get the user profile
    const userProfile = await this.getUserProfile(accessToken, accessTokenSecret, userIdentity.username);
    debug('Fetch user profile', userProfile);

    const profile = {...userIdentity, ...userProfile};

    // Verify the user and return it, or redirect
    try {
      user = await this.verify({
        accessToken,
        accessTokenSecret,
        profile,
        context: options.context,
      });
    } catch (error) {
      debug('Failed to verify user', error);
      const message = (error as Error).message;
      return await this.failure(message, request, sessionStorage, options);
    }

    debug('User authenticated', user);
    return await this.success(user, request, sessionStorage, options);
  }

  private getCallbackURL(url: URL) {
    if (this.callbackURL.startsWith('http:') || this.callbackURL.startsWith('https:')) {
      return new URL(this.callbackURL);
    }
    if (this.callbackURL.startsWith('/')) {
      return new URL(this.callbackURL, url);
    }
    return new URL(`${url.protocol}//${this.callbackURL}`);
  }

  /**
   * Step 1: Create a request for a consumer application to obtain a request token
   */
  private async getRequestToken(
    callbackUrl: URL,
    session: Session<SessionData, SessionData>,
  ): Promise<{
    requestToken: string;
    requestTokenSecret: string;
    callbackConfirmed: boolean;
    authorizeUrl: string;
  }> {
    const url = new URL(requestTokenURL);
    const timestamp = Date.now();
    const nonce = crypto.randomBytes(64).toString('hex');

    const urlString = url.toString();
    debug('Fetching request token', urlString);
    const response = await fetch(urlString, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `OAuth oauth_consumer_key="${this.consumerKey}", oauth_nonce="${nonce}", oauth_signature="${this.consumerSecret}&", oauth_signature_method="PLAINTEXT", oauth_timestamp="${timestamp}", oauth_callback="${encodeURIComponent(
          callbackUrl.toString(),
        )}"`,
        'User-Agent': DiscogsUserAgent,
      },
    });

    if (!response.ok) {
      const responseText = await response.text();
      throw new Response(responseText, {status: 401});
    }

    const responseText = await response.text();
    const searchParams = new URLSearchParams(responseText);
    const requestToken = searchParams.get('oauth_token') as string;
    const requestTokenSecret = searchParams.get('oauth_token_secret') as string;
    const callbackConfirmed = searchParams.get('oauth_callback_confirmed') === 'true';

    debug('Got request token', requestToken, requestTokenSecret, callbackConfirmed);

    // commit the session
    session.flash('requestTokenSecret', requestTokenSecret);
    await commitSession(session);

    return {
      requestToken,
      requestTokenSecret,
      callbackConfirmed,
      authorizeUrl: `https://discogs.com/oauth/authorize?oauth_token=${requestToken}`,
    };
  }

  /**
   * Step 2: Have the user authenticate, and send the consumer application a request token.
   */
  private getAuthURL(requestToken: string) {
    const params = new URLSearchParams();
    params.set('oauth_token', requestToken);

    const url = new URL(authorizationURL);
    url.search = params.toString();

    return url;
  }

  /**
   * Step 3: Convert the request token into a usable access token
   */
  private async getAccessToken(
    oauthToken: string,
    oauthVerifier: string,
    requestTokenSecret: string,
  ): Promise<{
    accessToken: string;
    accessTokenSecret: string;
  }> {
    const timestamp = Date.now();
    const nonce = crypto.randomBytes(64).toString('hex');

    debug('Fetch access token', tokenURL, oauthToken, oauthVerifier);
    const response = await fetch(tokenURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `OAuth oauth_consumer_key="${this.consumerKey}", oauth_nonce="${nonce}", oauth_token="${oauthToken}", oauth_signature="${this.consumerSecret}&${requestTokenSecret}", oauth_signature_method="PLAINTEXT", oauth_timestamp="${timestamp}", oauth_verifier="${oauthVerifier}"`,
        'User-Agent': DiscogsUserAgent,
      },
    });

    if (!response.ok) {
      const responseText = await response.text();
      debug('error! ' + responseText);
      throw new Response(responseText, {status: 401});
    }

    const responseBody = await response.text();
    debug('Access token response', responseBody);

    const searchParams = new URLSearchParams(responseBody);
    const accessToken = searchParams.get('oauth_token') as string;
    const accessTokenSecret = searchParams.get('oauth_token_secret') as string;

    return {
      accessToken,
      accessTokenSecret,
    };
  }

  /**
   * Step 4: Check user identity
   */
  private async checkUserIdentity(
    accessToken: string,
    accessTokenSecret: string,
  ): Promise<{
    id: number;
    username: string;
    resourceUrl: string;
    consumerName: string;
  }> {
    const timestamp = Date.now();
    const nonce = crypto.randomBytes(64).toString('hex');

    debug('Fetch access token', identityURL, accessToken, accessTokenSecret);
    const response = await fetch(identityURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `OAuth oauth_consumer_key="${this.consumerKey}", oauth_nonce="${nonce}", oauth_token="${accessToken}", oauth_signature="${this.consumerSecret}&${accessTokenSecret}", oauth_signature_method="PLAINTEXT", oauth_timestamp="${timestamp}"`,
        'User-Agent': DiscogsUserAgent,
      },
    });

    if (!response.ok) {
      const responseText = await response.text();
      debug('error! ' + responseText);
      throw new Response(responseText, {status: 401});
    }

    const responseBody = await response.json();
    return {
      id: responseBody.id,
      username: responseBody.username,
      resourceUrl: responseBody['resource_url'],
      consumerName: responseBody['consumer_name'],
    };
  }

  /**
   * Step 5: Fetch user profile to retrieve mandatory information to persist in the session
   */
  private async getUserProfile(
    accessToken: string,
    accessTokenSecret: string,
    username: string,
  ): Promise<{
    avatar: string;
    itemsInCollection: number;
    itemsInWantlist: number;
  }> {
    const timestamp = Date.now();
    const url = new URL(profileURL.replace('{username}', username));
    const nonce = crypto.randomBytes(64).toString('hex');

    debug('Fetch user profile', identityURL, accessToken, accessTokenSecret);
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `OAuth oauth_consumer_key="${this.consumerKey}", oauth_nonce="${nonce}", oauth_token="${accessToken}", oauth_signature="${this.consumerSecret}&${accessTokenSecret}", oauth_signature_method="PLAINTEXT", oauth_timestamp="${timestamp}"`,
        'User-Agent': DiscogsUserAgent,
      },
    });

    if (!response.ok) {
      const responseText = await response.text();
      debug('error! ' + responseText);
      throw new Response(responseText, {status: 401});
    }

    const responseBody = await response.json();
    return {
      avatar: responseBody['avatar_url'],
      itemsInCollection: responseBody['num_collection'],
      itemsInWantlist: responseBody['num_wantlist'],
    };
  }
}
