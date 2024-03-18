import type {MetaFunction} from '@vercel/remix';
import {defer} from '@vercel/remix';
import type {LoaderFunctionArgs} from '@vercel/remix';
import {Form, Link, NavLink, useLoaderData} from '@remix-run/react';
import {getSession} from '~/sessions.server';
import {DiscogsClient} from '@lionralfs/discogs-client';

export const meta: MetaFunction = () => {
  return [{title: 'Vinylogger'}, {name: 'description', content: 'Welcome to Vinylogger!'}];
};

export const loader = async ({request}: LoaderFunctionArgs) => {
  // Get storage session
  let session = await getSession(request.headers.get('cookie'));
  const accessToken = session.get('accessToken');
  const accessTokenSecret = session.get('accessTokenSecret');
  console.log('SESSION', session.data);

  // Check if user has already logged in to Discogs
  if (!accessToken || !accessTokenSecret) return null;

  // Fetch user identity
  const client = new DiscogsClient({
    auth: {
      method: 'oauth',
      consumerKey: process.env.DISCOGS_API_CONSUMER_KEY,
      consumerSecret: process.env.DISCOGS_API_CONSUMER_SECRET,
      accessToken: accessToken,
      accessTokenSecret: accessTokenSecret,
    },
  });
  const identity = await client.getIdentity();
  const {id, username: userName, resource_url: resourceUrl, consumer_name: consumerName} = identity.data;

  const userProfile = await client.user().getProfile(userName);

  const collectionValue = await client.user().collection().getValue(userName);

  return defer({
    id,
    name: userName,
    nbReleases: userProfile.data.num_collection,
    collectionMin: collectionValue.data.minimum,
    collectionMedian: collectionValue.data.median,
    collectionMax: collectionValue.data.maximum,
  });
};

export default function Index() {
  const user = useLoaderData<typeof loader>();

  return (
    <>
      {user ? (
        <div className="flex flex-col items-center md:items-start gap-8">
          <h2>Welcome, {user.name}🤘</h2>
          <h3>
            Your collection has <b>{user.nbReleases}</b> releases🔥
          </h3>
          <div className="grid grid-cols-3 divide-x self-stretch">
            <div className="flex flex-col gap-2 items-center">
              <span className="text-gray-700">Min</span>{' '}
              <span className="text-gray-800 font-bold">{user.collectionMin}</span>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <span className="text-gray-700">Median</span>{' '}
              <span className="text-gray-800 font-bold">{user.collectionMedian}</span>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <span className="text-gray-700">Max</span>{' '}
              <span className="text-gray-800 font-bold">{user.collectionMax}</span>
            </div>
          </div>
          <ul>
            <li>
              <Form method="post">
                <NavLink to="/logout" className="underline">
                  Log out
                </NavLink>
              </Form>
            </li>
          </ul>
        </div>
      ) : (
        <ul>
          <li>
            <NavLink to="/login" className="underline">
              Login with Discogs
            </NavLink>
          </li>
        </ul>
      )}
    </>
  );
}
