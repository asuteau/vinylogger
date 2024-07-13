import {Form, json, useLoaderData} from '@remix-run/react';
import type {LoaderFunctionArgs, MetaFunction} from '@vercel/remix';
import {Button} from '~/components/ui/button';
import {authenticator} from '~/services/auth.server';
import {sessionStorage} from '~/services/session.server';

type LoaderError = {message: string} | null;

export const meta: MetaFunction = () => {
  return [{title: 'Vinylogger'}, {name: 'description', content: 'Vinylogger - Home'}];
};

export const loader = async ({request}: LoaderFunctionArgs) => {
  await authenticator.isAuthenticated(request, {successRedirect: '/dashboard'});

  const session = await sessionStorage.getSession(request.headers.get('Cookie'));
  const error = session.get(authenticator.sessionErrorKey) as LoaderError;
  return json({error});
};

const Index = () => {
  const {error} = useLoaderData<typeof loader>();

  return (
    <div className="bg-red-100">
      <Form action="/login" method="post">
        {error ? <div>{error.message}</div> : null}
        <Button variant="link">Login with Discogs</Button>
      </Form>
    </div>
  );
};

export default Index;
