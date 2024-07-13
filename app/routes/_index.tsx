import type {LoaderFunctionArgs, MetaFunction} from '@vercel/remix';
import {authenticator} from '~/services/auth.server';

export const meta: MetaFunction = () => {
  return [{title: 'Vinylogger'}, {name: 'description', content: 'Vinylogger - Home'}];
};

export const loader = async ({request}: LoaderFunctionArgs) => {
  await authenticator.isAuthenticated(request, {successRedirect: '/dashboard'});

  return null;
};

const Index = () => {
  return null;
};

export default Index;
