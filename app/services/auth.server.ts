import {Authenticator} from 'remix-auth';
import {sessionStorage} from '@/services/session.server';
import {DiscogsStrategy, User} from '@/services/discogs.strategy';
import createDebug from 'debug';

let debug = createDebug('discogs:auth');

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<User>(sessionStorage);

const consumerKey = process.env.DISCOGS_API_CONSUMER_KEY;
const consumerSecret = process.env.DISCOGS_API_CONSUMER_SECRET;
if (!consumerKey || !consumerSecret) {
  throw new Error('DISCOGS_API_CONSUMER_KEY and DISCOGS_API_CONSUMER_SECRET must be provided');
}

const isInProduction = process.env.NODE_ENV === 'production';
const appProductionUrl = process.env.APP_PRODUCTION_URL;
if (isInProduction && !appProductionUrl) {
  throw new Error('APP_PRODUCTION_URL must be provided in production');
}

authenticator.use(
  new DiscogsStrategy(
    {
      consumerKey,
      consumerSecret,
      callbackURL: `${isInProduction ? appProductionUrl : 'http://localhost:3000'}/login/callback`,
    },
    // Define what to do when the user is authenticated
    async ({accessToken, accessTokenSecret, profile}) => {
      // profile contains userId and screenName
      debug('User authenticated', accessToken, accessTokenSecret, profile);

      // Return a user object to store in sessionStorage.
      // You can also throw Error to reject the login
      return {accessToken, accessTokenSecret, consumerKey, consumerSecret, ...profile};
    },
  ),
  // each strategy has a name and can be changed to use another one
  // same strategy multiple times, especially useful for the OAuth2 strategy.
  'discogs',
);
