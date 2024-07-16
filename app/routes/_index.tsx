import {VinylRecord} from '@phosphor-icons/react/dist/icons/VinylRecord';
import {Form, json, useLoaderData} from '@remix-run/react';
import type {LoaderFunctionArgs, MetaFunction} from '@vercel/remix';
import Logo from '~/components/Logo';
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
    <div className="h-[100dvh] bg-gradient-to-b from-slate-50 to-slate-200">
      <header className="bg-background/75 backdrop-blur border-b border-gray-200 dark:border-gray-800 -mb-px sticky top-0 z-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex items-center justify-between gap-3 h-[64px]">
          <div className="flex gap-2 items-center">
            <VinylRecord size="32" weight="duotone" />
            <span className="font-['BricolageGrotesque'] text-slate-900 text-xl">Vinylogger</span>
          </div>
          <Form action="/login" method="post" className="ml-auto">
            {error ? <div>{error.message}</div> : null}
            <Button variant="default">Login with Discogs</Button>
          </Form>
        </div>
      </header>

      <section className="h-[calc(100%-64px)] p-8 md:p-0 flex flex-col justify-center text-center md:text-left max-w-7xl mx-auto">
        <div className="grid grid-rows-2 md:grid-rows-none md:grid-cols-2 gap-4">
          <h1 className="text-slate-400 text-3xl md:text-6xl py-8 md:py-16">
            Track your vinyl
            <br />
            <span className="text-slate-500">collection</span>
            <br />
            <span className="text-slate-900">effortlessly</span>
          </h1>

          <div className="bg-landing bg-cover bg-center rounded-lg -rotate-6 shadow-lg" />
        </div>
      </section>
    </div>
  );
};

export default Index;
