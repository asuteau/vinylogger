import { DiscogsClient } from '@lionralfs/discogs-client';
import { LoaderFunctionArgs, json } from '@remix-run/node';
import { Form, Link, useLoaderData } from '@remix-run/react';
import { getUserIdentity, getUserProfile } from '~/services/discogs';
import { getSession } from '~/sessions.server';

export function headers({
  loaderHeaders,
  parentHeaders,
}: {
  loaderHeaders: Headers;
  parentHeaders: Headers;
}) {
  console.log(
    'This is an example of how to set caching headers for a route, feel free to change the value of 60 seconds or remove the header',
  );
  return {
    // This is an example of how to set caching headers for a route
    // For more info on headers in Remix, see: https://remix.run/docs/en/v1/route/headers
    'Cache-Control': 'public, max-age=60, s-maxage=60',
  };
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Get storage session
  let session = await getSession(request.headers.get("cookie"));
  const accessToken = session.get('accessToken')
  const accessTokenSecret = session.get('accessTokenSecret')
  console.log('SESSION', session.data)

  // Check if user has already logged in to Discogs
  if (!accessToken || !accessTokenSecret) return null

  // Fetch user identity
  const client = new DiscogsClient({
    auth: {
      method: 'oauth',
      consumerKey: process.env.DISCOGS_API_CONSUMER_KEY,
      consumerSecret: process.env.DISCOGS_API_CONSUMER_SECRET,
      accessToken: accessToken,
      accessTokenSecret: accessTokenSecret
    }
  })
  const identity = await client.getIdentity()
  const {id, username: userName, resource_url: resourceUrl, consumer_name: consumerName} = identity.data

  const userProfile = await client.user().getProfile(userName)
  
  return json({
    id,
    name: userName,
    nbReleases: userProfile.data.num_collection
  })
}

export default function Index() {
  const user = useLoaderData<typeof loader>();

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1>Vinylogger</h1>
      {user ? <><h2>Welcome, {user.name}</h2><h3>You have {user.nbReleases} releases in your collection!</h3>
        <ul>
          <li>
            <Form method='post'>
              <Link to="/logout">Log out</Link>
            </Form>
          </li>
        </ul></> :
        <ul>
          <li>
            <Link to="/login">Login with Discogs</Link>
          </li>
        </ul>
      }
    </main>
  );
}
