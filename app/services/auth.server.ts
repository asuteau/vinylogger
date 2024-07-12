import {Authenticator} from 'remix-auth';
import {sessionStorage} from '~/services/session.server';
import {DiscogsStrategy, User} from './discogs.strategy';
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

authenticator.use(
  new DiscogsStrategy(
    {
      consumerKey,
      consumerSecret,
      callbackURL: 'http://localhost:3000/login/callback',
    },
    // Define what to do when the user is authenticated
    async ({accessToken, accessTokenSecret}) => {
      // profile contains userId and screenName
      debug('User authenticated', accessToken, accessTokenSecret);

      // Return a user object to store in sessionStorage.
      // You can also throw Error to reject the login
      return new Promise((resolve) =>
        resolve({
          id: 1,
          consumerName: 'John Doe',
          resourceUrl: 'https://www.discogs.com/user/jdoe',
          username: 'jdoe',
        }),
      );
    },
  ),
  // each strategy has a name and can be changed to use another one
  // same strategy multiple times, especially useful for the OAuth2 strategy.
  'discogs',
);
