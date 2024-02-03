import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { buildAuthorizationUrl, getRequestToken } from "~/services/discogs";
import { commitSession, getSession } from "~/sessions.server";

// Provides data to the component
export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Initiating the Request Token
  const isProduction = process.env.NODE_ENV === "production"
  const redirectUrl = isProduction ? 'https://vinylogger.netlify.app/auth' : 'http://localhost:3000/auth'
  const { requestToken, requestTokenSecret } = await getRequestToken(process.env.DISCOGS_API_CONSUMER_KEY, process.env.DISCOGS_API_CONSUMER_SECRET, redirectUrl)

  // Get storage session
  let session = await getSession(request.headers.get("cookie"));
  console.log('SESSION', session.data)
  session.set('requestToken', requestToken)
  session.set('requestTokenSecret', requestTokenSecret)

  // Redirect to Discogs authorization URL
  return redirect(buildAuthorizationUrl(requestToken), {
    headers: {
      // Commit the session storage
      "Set-Cookie": await commitSession(session)
    }
  })
}

// Renders the UI
const Login = () =>
  <h1>
    Login page
  </h1>;


// Updates persistent data
export const action = async () => { }

export default Login;
