import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getAccessToken, getUserIdentity } from "~/services/discogs";
import { commitSession, getSession } from "~/sessions.server";

// Provides data to the component
export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Get session storage
  let session = await getSession(request.headers.get("cookie"));
  const requestToken = session.get('requestToken') as string
  const requestTokenSecret = session.get('requestTokenSecret') as string

  // Fetch verifier from query params
  const url = new URL(request.url)
  const userVerifier = url.searchParams.get("oauth_verifier") as string

  console.log('requestToken', requestToken)
  console.log('requestTokenSecret', requestTokenSecret)
  console.log('userVerifier', userVerifier)

  // Retrieve access token
  const { accessToken, accessTokenSecret } = await getAccessToken(process.env.DISCOGS_API_CONSUMER_KEY, process.env.DISCOGS_API_CONSUMER_SECRET, requestToken, requestTokenSecret, userVerifier)
  console.log('accessToken', accessToken)
  console.log('accessTokenSecret', accessTokenSecret)

  session.set('accessToken', accessToken)
  session.set('accessTokenSecret', accessTokenSecret)

  return redirect('/', {
    headers: {
      // Commit the session storage
      "Set-Cookie": await commitSession(session)
    }
  })
}

// Renders the UI
const Auth = () =>
  <h1>
    Auth page
  </h1>;


// Updates persistent data
export const action = async () => { }

export default Auth;
