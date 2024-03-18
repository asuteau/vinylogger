import type {MetaFunction} from '@vercel/remix';
import {defer} from '@vercel/remix';
import type {LoaderFunctionArgs} from '@vercel/remix';
import {Form, NavLink, useLoaderData} from '@remix-run/react';
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

  const collection = await client.user().collection().getReleases(userName, 0, {
    per_page: 20,
    sort: 'added',
    sort_order: 'desc',
  });

  return defer({
    id,
    name: userName,
    nbReleases: userProfile.data.num_collection,
    collectionMin: collectionValue.data.minimum,
    collectionMedian: collectionValue.data.median,
    collectionMax: collectionValue.data.maximum,
    lastPurchased: collection.data.releases.map((release) => {
      return {
        artist: release.basic_information.artists.map((artist) => artist.name).join(', '),
        title: release.basic_information.title,
        thumbnail: release.basic_information.thumb,
        releaseType: release.basic_information.formats.map((format) => format.name).join(', '),
        dateAdded: new Date(release.date_added).toLocaleDateString(),
      };
    }),
  });
};

export default function Index() {
  const user = useLoaderData<typeof loader>();

  return (
    <>
      {user ? (
        <div className="flex flex-col gap-10 h-full">
          <h2>Welcome, {user.name}🤘</h2>
          <div className="space-y-1">
            <h3 className="font-bold text-gray-950">Purchased recently</h3>
            <h3 className="text-gray-600">
              <b>{user.nbReleases}</b> releases in collection
            </h3>
            <section className="flex flex-col gap-4 p-4 bg-gray-100 rounded-xl max-h-60 overflow-auto overflow-x-hidden">
              {user.lastPurchased.map((release) => {
                return (
                  <div className="flex items-center gap-4">
                    <img src={release.thumbnail} className="w-24 h-24 rounded-lg shadow-sm" />
                    <div className="flex flex-col text-xs text-gray-950">
                      <span className="font-bold">{release.artist}</span>
                      <span>{release.title}</span>
                      <span className="text-gray-600">{release.releaseType}</span>
                      <span className="text-gray-500">Purchased on {release.dateAdded}</span>
                    </div>
                  </div>
                );
              })}
            </section>
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-gray-950">Collection value</h3>
            <section className="grid grid-cols-3 divide-x self-stretch bg-gray-100 rounded-xl">
              <div className="flex flex-col gap-2 p-2 items-center">
                <span className="text-gray-700 text-sm">Min</span>{' '}
                <span className="text-gray-800 font-bold">{user.collectionMin}</span>
              </div>
              <div className="flex flex-col gap-2 p-2 items-center">
                <span className="text-gray-700 text-sm">Median</span>{' '}
                <span className="text-gray-800 font-bold">{user.collectionMedian}</span>
              </div>
              <div className="flex flex-col gap-2 p-2 items-center">
                <span className="text-gray-700 text-sm">Max</span>{' '}
                <span className="text-gray-800 font-bold">{user.collectionMax}</span>
              </div>
            </section>
          </div>
          <ul className="mt-auto">
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
