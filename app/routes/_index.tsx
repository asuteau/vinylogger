import { LoaderFunctionArgs } from '@remix-run/node';
import { Link } from '@remix-run/react';
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
  console.log('SESSION', session.data)

  return null
}

export default function Index() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1>Vinylogger</h1>
      <ul>
        <li>
          <Link to="/login">Login with Discogs</Link>
        </li>
      </ul>
    </main>
  );
}
