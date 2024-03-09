import type {MetaFunction} from '@vercel/remix';
import {defer} from '@vercel/remix';
import type {LoaderFunctionArgs} from '@vercel/remix';
import {Form, Link, useLoaderData} from '@remix-run/react';
import {getSession} from '~/sessions.server';
import {DiscogsClient} from '@lionralfs/discogs-client';
import {VinylRecord} from '@phosphor-icons/react';
import Navbar from '~/components/Navbar';
import Header from '~/components/Header';

export const meta: MetaFunction = () => {
  return [{title: 'New Remix App'}, {name: 'description', content: 'Welcome to Remix!'}];
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

  return defer({
    id,
    name: userName,
    nbReleases: userProfile.data.num_collection,
  });
};

export default function Index() {
  const user = useLoaderData<typeof loader>();

  return (
    <>
      <div className="layout bg-gray-50">
        <Navbar />
        <Header />
        <section className="layout-main p-8 space-y-4">
          {user ? (
            <>
              <h2>Welcome, {user.name}</h2>
              <h3>You have {user.nbReleases} releases in your collection!</h3>
              <ul>
                <li>
                  <Form method="post">
                    <Link to="/logout">Log out</Link>
                  </Form>
                </li>
              </ul>
            </>
          ) : (
            <ul>
              <li>
                <Link to="/login">Login with Discogs</Link>
              </li>
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
