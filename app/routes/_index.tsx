import {VinylRecord} from '@phosphor-icons/react/dist/icons/VinylRecord';
import {Form, json, useLoaderData} from '@remix-run/react';
import type {LoaderFunctionArgs, MetaFunction} from '@vercel/remix';
import {Button} from '@/components/ui/button';
import {authenticator} from '@/services/auth.server';
import {sessionStorage} from '@/services/session.server';
import BackgroundGrid from '@/components/BackgroundGrid';

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
    <div className="h-[100dvh]">
      <div className="fixed left-0 top-0 -z-10 h-full w-full">
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]" />
      </div>

      <header className="bg-background/75 backdrop-blur border-b border-gray-200 dark:border-gray-800 -mb-px sticky top-0 z-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex items-center justify-between gap-3 h-[64px]">
          <div className="flex gap-2 items-center">
            <VinylRecord size="32" weight="duotone" />
            <span className="font-['BricolageGrotesque'] font-bold text-slate-900 text-xl">Vinylogger</span>
          </div>
          <Form action="/login" method="post" className="ml-auto">
            {error ? <div>{error.message}</div> : null}
            <Button size="sm" variant="default">
              Sign in with Discogs
            </Button>
          </Form>
        </div>
      </header>

      <section className="text-center my-24 mx-4">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-foreground text-4xl sm:text-5xl sm:leading-none lg:text-7xl">
            <span className="block text-slate-900">Track your records</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22d3ee] via-[#0ea5e9] to-[#0284c7] block md:ml-0">
              effortlessly
            </span>
          </h1>
          <p className="text-base lg:text-lg">
            Vinylogger is an open source alternative to Discogs.
            <br />
            Start searching for records and adding them to your collection or wantlist.
            <br /> Vinylogger will synchronize seamlessly with your Discogs account.
          </p>

          <Form action="/login" method="post">
            {error ? <div>{error.message}</div> : null}
            <Button size="lg" variant="default">
              <VinylRecord size="24" className="mr-2" />
              Get started
            </Button>
          </Form>
        </div>
      </section>
    </div>
  );
};

export default Index;
